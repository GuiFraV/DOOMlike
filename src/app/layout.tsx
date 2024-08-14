import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doom-like Game",
  description: "A Doom-like game built with Next.js and Three.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
