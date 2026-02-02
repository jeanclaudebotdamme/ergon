"use client";

import "./globals.css";
import { KanbanProvider } from "@/components/KanbanContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">
        <KanbanProvider>
          {children}
        </KanbanProvider>
      </body>
    </html>
  );
}
