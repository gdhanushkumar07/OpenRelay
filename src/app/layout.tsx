import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenRelay",
  description: "OpenRelay enables AI agents from different organizations to securely communicate, share context, route work, and resolve business workflows without manual coordination. Powered by OpenRelay and Aicoo.",
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{ name: "Aicoo Hackathon Team" }],
  openGraph: {
    title: "OpenRelay — Cross-Company Workflow Coordination",
    description: "Autonomously coordinate, negotiate, and execute business workflows with Aicoo.",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans">
        {children}
      </body>
    </html>
  );
}

