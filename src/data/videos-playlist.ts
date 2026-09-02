export type VideoAction = { label: string; link: string };

type VideoSource = {
  id: string;
  title: string;
  link: string;
  description: string;
  actions?: VideoAction[];
};

/** A video ready to render: its authored fields plus the embeddable player URL. */
export type Video = VideoSource & { embed: string };

/**
 * The content of the videos page. Add, remove or reorder entries here — the
 * first one is loaded into the player, the rest play when picked from the
 * list. `link` is a YouTube or Google Drive share URL; see toEmbedUrl below
 * for the accepted forms. `id` is the video's share slug — it appears in the
 * URL as ?video=<id>, so renaming one breaks links people have already shared.
 */
const sources: VideoSource[] = [
  {
    id: "admin-configuration-settings",
    title: "Administrator Configurations & Settings (2026)",
    link: "https://drive.google.com/file/d/1MIT-oRonn2yKgiaXj5H_S0-pqI3gU7sQ/view?usp=drive_link",
    description: "Here we show how to use the admin customization settings to configure the user experience of mobile device users, AI integration, and more.",
    actions: [],
  },
  {
    id: "customizing-event-forms",
    title: "Customizing Event Forms (2026)",
    link: "https://drive.google.com/file/d/1wD67e9GmdBFWciGZeGa-SqU5eRTQeSQ0/view?usp=drive_link",
    description: "This video shows how to use the form builder UI in the admin portal to create and update event forms with custom fields.",
    actions: [{ label: "Dynamic Event Forms", link: "/docs/core-concepts/dynamic-event-forms" }],
  },
  {
    id: "customizing-patient-registration-forms",
    title: "Customizing Patient Registration Forms (2026)",
    link: "https://drive.google.com/file/d/1vXgg-PTF1DeRMYZohOXE0YY7nKCZxsg1/view?usp=drive_link",
    description: "How to use the form builder to create custom patient registration forms, organizing inputs, and defining the data needed.",
    actions: [],
  },
  {
    id: "reviewing-registered-patient-data",
    title: "Revieweing Registered Patient Data (2026)",
    link: "https://drive.google.com/file/d/13VxLrU1T25zbOhZm0hFCiWzieye4d6zc/view?usp=drive_link",
    description: "How the administrator can find, view, and manage existing patient records across the entire Hikma Health EHR installation.",
    actions: [{ label: "Key Concepts", link: "/docs/introduction/key-concepts" }],
  },
  {
    id: "ai-powered-report-generation",
    title: "AI Powered Report Generation",
    link: "https://drive.google.com/file/d/1qk_9ykzHJmN0YwiLK0FEFWuOfXVkPOQL/view?usp=drive_link",
    description: "Use AI/LLMs to support the generation and customization of custom reports to perform analysis of your clinic/organization data.",
    actions: [{ label: "Key Concepts", link: "/docs/introduction/key-concepts" }],
  },
];

/**
 * Turns a YouTube or Google Drive share link into its embeddable form.
 * Throws on anything it cannot embed, so a bad link fails the build rather
 * than shipping a broken player.
 */
function toEmbedUrl(link: string): string {
  let url: URL;
  try {
    url = new URL(link);
  } catch {
    throw new Error(`Video link is not a valid URL: ${link}`);
  }

  const host = url.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.slice(1);
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    const id =
      url.searchParams.get("v") ??
      url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/)?.[1];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }

  if (host === "drive.google.com") {
    const id =
      url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ??
      url.searchParams.get("id");
    if (id) return `https://drive.google.com/file/d/${id}/preview`;
  }

  throw new Error(
    `Cannot embed video link: ${link}. Expected a YouTube watch/share link or a Google Drive file link.`,
  );
}

if (sources.length === 0) {
  throw new Error("Add at least one entry to the videos list in videos-playlist.ts.");
}

const ids = sources.map((source) => source.id);
if (ids.some((id) => id.trim() === "")) {
  throw new Error("Every video in videos-playlist.ts needs a non-empty id; it is the ?video= value in share links.");
}
if (new Set(ids).size !== ids.length) {
  throw new Error("Video ids in videos-playlist.ts must be unique; they are the ?video= value in share links.");
}

export const videos: Video[] = sources.map((source) => ({
  ...source,
  embed: toEmbedUrl(source.link),
}));
