import React, { ReactNode } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>GenLayer Relay Dashboard</title>
      </head>
      <body>
        <main className="app-container">{children}</main>
      </body>
    </html>
  );
}
