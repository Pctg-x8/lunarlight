import "@/styles/globals.scss";
import React from "react";

export default function App({ children }: { readonly children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
