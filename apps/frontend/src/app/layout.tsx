import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentReplay",
  description: "AI Agent Observability Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}