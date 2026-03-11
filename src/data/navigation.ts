export interface NavItem {
  title: string;
  href: string;
}

export interface NavSection {
  title: string;
  emoji?: string;
  items: NavItem[];
}

export const navigation: NavSection[] = [
  {
    title: "Introduction",
    items: [
      { title: "Getting started", href: "/docs/introduction/getting-started" },
      {
        title: "Releases & Changes",
        href: "/docs/introduction/releases-and-changes",
      },
      { title: "Key Concepts", href: "/docs/introduction/key-concepts" },
      { title: "Try the demo", href: "/docs/introduction/try-the-demo" },
      { title: "FAQ", href: "/docs/introduction/faq" },
    ],
  },
  {
    title: "Deployment",
    emoji: "🚀",
    items: [
      { title: "Quick Start", href: "/docs/deployment/quick-start" },
      {
        title: "Hosting Options",
        href: "/docs/deployment/hosting-options",
      },
    ],
  },
  {
    title: "Core concepts",
    items: [
      {
        title: "Architecture guide",
        href: "/docs/core-concepts/architecture-guide",
      },
      {
        title: "Dynamic Event Forms",
        href: "/docs/core-concepts/dynamic-event-forms",
      },
      {
        title: "Offline & Sync",
        href: "/docs/core-concepts/offline-and-sync",
      },
    ],
  },
  {
    title: "Security",
    emoji: "🔒",
    items: [
      {
        title: "Security Considerations",
        href: "/docs/security-guides/security-considerations",
      },
      {
        title: "Permissions & Access Control",
        href: "/docs/security-guides/permissions-and-capabilities",
      },
    ],
  },
  {
    title: "Mobile Guides",
    items: [
      { title: "Overview", href: "/docs/mobile-guides/overview" },
      { title: "Data Synchronization", href: "/docs/mobile-guides/data-sync" },
      { title: "Performance", href: "/docs/mobile-guides/performance" },
    ],
  },
  {
    title: "Server Guides",
    items: [{ title: "Overview", href: "/docs/server-guides/overview" }],
  },
  {
    title: "Customization",
    items: [
      {
        title: "Customization Options",
        href: "/docs/customization/customization-options",
      },
    ],
  },
  {
    title: "Contributing",
    items: [
      {
        title: "How to contribute",
        href: "/docs/contributing/how-to-contribute",
      },
    ],
  },
];
