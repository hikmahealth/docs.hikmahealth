---
title: "Reporting Integration"
description: "Send reporting data to Hikma Health programmatically, from a Hikma Health EHR instance or from your own system."
order: 2
---

## Overview

Hikma Health can receive reporting data from Hikma Health EHR deployments and from any external system that wants to integrate. All requests go to the gateway at `https://api.hikmahealth.org`.

There are two ways to connect:

1. **Push with an access key.** A Hikma Health admin registers your organization and gives you an access key. Your services sign their requests with it and push data to us.
2. **Connect your instance.** Your EHR instance registers itself, then a Hikma Health admin verifies it. Hikma Health EHR instances do this with one click from the EHR's admin settings. You can also implement it yourself.

Every request is signed with your access key: an Ed25519 JWT that carries `sub`, `iat` and a `digest` of the request body.

### Pick an integration

| | **A. Push with an access key** | **B. Connect your instance** |
|---|---|---|
| Use it when | you run a service that sends us data | you run an EHR instance that should connect itself |
| How you get credentials | a Hikma Health admin creates an access key and sends you its signing key | your instance registers itself; an admin then verifies it |
| What you build | sign requests and push data | everything in A, plus registration and, optionally, a report URL we pull from |

## Sign every request

Every request carries `Authorization: Bearer <token>`. The token is a JWT signed with your Ed25519 signing key:

- header: `{ "alg": "EdDSA", "typ": "JWT" }`
- claims:
  - `sub`: your `client_id`
  - `iat`: the current time, in whole seconds
  - `digest`: the SHA-256 hex of the exact body bytes you send, or of `""` for a request with no body
  - `exp` (optional): an earlier expiry, in seconds

Tokens are accepted for 10 minutes after `iat`, with 60 seconds of clock skew. Sign each request just before you send it, and send exactly the bytes you hashed. Re-serializing the JSON after signing breaks the digest.

```js
import { createHash, createPrivateKey, sign } from "node:crypto"

const segment = (value) => Buffer.from(JSON.stringify(value)).toString("base64url")

/** Bearer token for one request; `signingKey` is the base64url key you were given */
export function signRequest(clientId, signingKey, body = "") {
  const header = segment({ alg: "EdDSA", typ: "JWT" })
  const claims = segment({
    sub: clientId,
    iat: Math.floor(Date.now() / 1000),
    digest: createHash("sha256").update(body).digest("hex"),
  })
  const key = createPrivateKey({ key: Buffer.from(signingKey, "base64url"), format: "der", type: "pkcs8" })
  return `${header}.${claims}.${sign(null, Buffer.from(`${header}.${claims}`), key).toString("base64url")}`
}
```

The signing key is shown once and never stored by Hikma Health. Keep it in a secrets store, never in source control or logs. If it's lost or leaked, ask for a new access key.

## Push data

`POST /v1/ehr-reporting` with `Content-Type: application/json` and a body of at most 5 MB, wrapped in an envelope:

```json
{ "kind": "patient_summary", "kind_version": 1, "data": { "visits": 42 } }
```

- `kind`: what the data is, named by you. Lowercase letters, digits, `_`, `.` and `-`, starting with a letter or digit, up to 64 characters.
- `kind_version`: the version of that kind's shape, an integer of 1 or more. Bump it whenever the shape of `data` changes.
- `data`: a JSON object.

No other top-level keys are allowed.

```js
const body = JSON.stringify({ kind: "patient_summary", kind_version: 1, data: { visits: 42 } })
const response = await fetch("https://api.hikmahealth.org/v1/ehr-reporting", {
  method: "POST",
  headers: { "Content-Type": "application/json", "Authorization": `Bearer ${signRequest(clientId, signingKey, body)}` },
  body,
})
// 202: { ok: true, data: { id, received_at } }
```

Don't put anything in `data` that identifies a patient. Send aggregates.

## Connect your instance (integration B)

1. **Register.** `POST /v1/ehr-reporting/register`, unsigned, with `{ "organization_name": "…", "contact_email": "…" }`. The name is 1–120 characters; `contact_email` is optional. The `201` response:

   ```json
   {
     "ok": true,
     "credentials": {
       "client_id": "api_…",
       "client_signing_key": "…",
       "client_verifying_key": "…",
       "reporter_id": "…",
       "version": 1
     }
   }
   ```

   Store all five fields securely; they're returned only once.
   - `client_id` and `client_signing_key` sign your requests (see [Sign every request](#sign-every-request)).
   - `client_verifying_key` and `reporter_id` let you check that a pull really comes from Hikma Health (see [Serve a report URL](#serve-a-report-url-optional)).
2. **Send your report URL** (optional, only if you serve pulls). `PUT /v1/ehr-reporting/details`, signed, with `{ "report_url": "https://…" }`. The URL's origin becomes your deployment. Once you're verified, the URL can only change within that origin.
3. **Wait for verification.** A Hikma Health admin reviews the registration and either approves it, attaches it to an existing organization, or rejects it. You can push data in the meantime; it's held until you're verified. `GET /v1/ehr-reporting/registration`, signed, returns `verification_status`: `unverified`, `verified` or, with a `403`, `rejected`.
4. **Disconnect.** `DELETE /v1/ehr-reporting/registration`, signed. While still unverified, this removes the registration and everything sent with it. Once verified, it removes the report URL and the data pulled through it; pushed data stays with your organization.

## Serve a report URL (optional)

Once you're verified, Hikma Health may `POST` to your report URL with a JSON body of `{ "startDate"?: "YYYY-MM-DD", "endDate"?: "YYYY-MM-DD" }`. Either date may be missing or `null`.

Before answering, verify the request's `Authorization: Bearer <token>`. Treat any failure as `401`:

```js
import { createHash, createPublicKey, verify } from "node:crypto"

const decode = (segment) => JSON.parse(Buffer.from(segment, "base64url").toString("utf8"))

/** Whether a pull came from Hikma Health; `rawBody` is the exact request body as received */
export function isHikmaPull(authorization, rawBody, { reporter_id, client_verifying_key }) {
  try {
    const [header, claims, signature] = (authorization ?? "").replace(/^Bearer\s+/i, "").split(".")
    const key = createPublicKey({ key: Buffer.from(client_verifying_key, "base64url"), format: "der", type: "spki" })
    if (!verify(null, Buffer.from(`${header}.${claims}`), key, Buffer.from(signature, "base64url"))) return false

    const { alg } = decode(header)
    const { sub, exp, digest } = decode(claims)
    const now = Math.floor(Date.now() / 1000)
    return (
      alg === "EdDSA" &&
      sub === reporter_id &&
      now <= exp + 60 &&
      digest === createHash("sha256").update(rawBody).digest("hex")
    )
  } catch {
    return false
  }
}
```

Then respond `2xx` with the same envelope as in [Push data](#push-data), within 15 seconds and under 5 MB. A bare JSON object without the envelope is stored as `kind = analytics`. The URL must be `https`, and redirects aren't followed. Pull tokens are valid for 60 seconds.

## Responses

Every response is JSON: `{ "ok": true, … }` or `{ "ok": false, "error": "…" }`.

| Status | Meaning | What to do |
|---|---|---|
| `400` | invalid JSON, or an invalid register or details body | fix the request |
| `401` | missing, malformed, expired or wrongly signed token, or the digest doesn't match the body | check your signing; check your clock |
| `403` | the organization was rejected, or the key lacks the needed scope | contact Hikma Health |
| `404` | no reporter for this organization | register again |
| `409` | the report URL is already registered, or is off your verified origin | use a URL on your verified origin |
| `413` | body over the size limit | send less per request |
| `415` | missing `Content-Type: application/json` | set the header |
| `422` | the body isn't a valid envelope | check the envelope format |
| `429` | too many registration attempts | wait for `Retry-After` |
| `503` | registrations are paused | try again later |
| `5xx` | server or gateway error | retry with backoff; resend with a new token |
