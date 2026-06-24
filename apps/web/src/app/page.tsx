"use client";

import { useAuth } from "@/src/components/auth-provider";
import { RequireAuth } from "@/src/components/require-auth";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

function HomeContent() {
  const { user, logout } = useAuth();

  return (
    <main className="flex min-h-full flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">
            Olá, {user?.username ?? "usuário"} 👋
          </CardTitle>
          <CardDescription>Você está autenticado.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Usuário</dt>
            <dd>{user?.username ?? "—"}</dd>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd>{user?.email ?? "—"}</dd>
          </dl>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

export default function Home() {
  return (
    <RequireAuth>
      <HomeContent />
    </RequireAuth>
  );
}
