---
title: Hosting Options
description: Overview of how we achieve an offline first strategy that truly scales to tens of thousands of patients comfortably
---

The Hikma Health EHR can be hosted on almost all hosting providers. You can either choose the recommended options, or set up your own.

---

## Hosting Considerations

To keep overall costs low, it is recommended to deploy on a serverless service on any of your favorite cloud hosting providers. There are many options including:

- [Render](https://render.com/) (Recommended)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [Google Cloud Functions](https://cloud.google.com/functions)
- [Google Cloud Run](https://cloud.google.com/run)
- [Digital Ocean Functions](https://www.digitalocean.com/products/functions/)
- [Railway App](https://railway.app/)
- [Azure functions](https://azure.microsoft.com/en-us/services/functions/)

... and more ...

Whichever provider you choose to go with, it is HIGHLY recommended to deploy all your solutions to the same provider to reduce the need for multiple logins and authentication processes.

_Important:_ Make sure that whichever "region" or "location" that you choose for our server, you should select the same (or as close to it as possible) for your database. This will reduce the time it takes for the server to communicate with the database (latency).
