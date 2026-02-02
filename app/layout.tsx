import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ergon — Kanban Dashboard",
  description: "A Kanban collaboration dashboard for team productivity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
