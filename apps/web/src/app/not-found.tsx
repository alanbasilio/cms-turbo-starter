import Link from "next/link";
import { Button } from "@/src/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="space-y-1">
        <p className="text-3xl font-semibold">404</p>
        <p className="text-sm text-muted-foreground">
          A página que você procura não existe.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Voltar ao início</Link>
      </Button>
    </main>
  );
}
