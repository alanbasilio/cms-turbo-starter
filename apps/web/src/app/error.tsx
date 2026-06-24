"use client";

import { useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { getApiErrorMessage } from "@/src/lib/api-client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for observability; swap for a real reporter later.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-1">
        <p className="text-lg font-semibold">Algo deu errado</p>
        <p className="text-sm text-muted-foreground">
          {getApiErrorMessage(error)}
        </p>
      </div>
      <Button variant="outline" onClick={reset}>
        Tentar novamente
      </Button>
    </main>
  );
}
