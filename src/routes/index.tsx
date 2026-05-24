import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "../LandingPage.jsx";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "AutoPilot AI — Your Business, Running 24/7 Without Hiring Anyone" },
      {
        name: "description",
        content:
          "AI automations for Indian SMBs. Replace manual work with 24/7 systems. ₹15,000/month automations that outperform a ₹20,000/month hire.",
      },
    ],
  }),
});
