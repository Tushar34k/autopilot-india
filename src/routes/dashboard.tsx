import { createFileRoute } from "@tanstack/react-router";
// @ts-expect-error JSX module
import App from "../App.jsx";

export const Route = createFileRoute("/dashboard")({
  component: App,
  head: () => ({
    meta: [
      { title: "Operations Hub — AutoPilot AI" },
      { name: "description", content: "Internal operations hub." },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
});
