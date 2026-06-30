"use client";

import { useEffect } from "react";

// global-error replaces the root layout, so it must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>Algo deu errado</p>
        <button type="button" onClick={reset}>
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
