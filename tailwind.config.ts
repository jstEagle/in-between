import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx,json}"
  ],
  theme: {
    extend: {
      colors: {
        page: {
          bg: "var(--page-bg)",
          fg: "var(--page-fg)",
          accent: "var(--page-accent)",
          accent2: "var(--page-accent2)",
          muted: "var(--page-muted)",
          border: "var(--page-border)",
          link: "var(--page-link)",
          danger: "var(--page-danger)"
        }
      },
      fontFamily: {
        primary: "var(--page-font-primary)",
        intrusion: "var(--page-font-intrusion)",
        accent: "var(--page-font-accent)",
        headline: "var(--page-font-headline)"
      }
    }
  }
};

export default config;
