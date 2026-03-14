import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenOps Autopilot — Carbon-Aware Cloud Scheduling",
  description: "Reduce AI and cloud workload carbon emissions automatically.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
