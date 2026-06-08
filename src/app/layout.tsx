import type { Metadata } from "next";
import Script from "next/script";

import "./globals.css";

const ASSISTANT_SCRIPT_SRC =
  "https://ai-companion-edit-mode-assistant-nextjs.scripts.codedesign.ai/";

export const metadata: Metadata = {
  title: "AI Deal Review CRM",
  description: "Salesforce-like CRM browser application with AI Deal Review Agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Barlow:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          id="ai-companion-edit-mode-assistant"
          src={ASSISTANT_SCRIPT_SRC}
          strategy="beforeInteractive"
        />
        {children}
      </body>
    </html>
  );
}
