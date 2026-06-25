"use client";

import Link from "next/link";
import { RequireAuth } from "@/src/components/require-auth";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { useGetArticles } from "@/src/generated/hooks/useGetArticles";

function ArticlesList() {
  const { data, isPending, isError } = useGetArticles({
    sort: "publishedAt:desc",
  });

  const articles = data?.data ?? [];

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Artigos</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/">Início</Link>
        </Button>
      </header>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Carregando artigos...</p>
      ) : isError ? (
        <p className="text-sm text-destructive" role="alert">
          Não foi possível carregar os artigos.
        </p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum artigo ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <li key={article.documentId ?? article.slug}>
              <Link href={`/articles/${article.slug}`} className="block">
                <Card className="transition-colors hover:border-primary">
                  <CardHeader>
                    <CardTitle className="text-base">{article.title}</CardTitle>
                    {article.excerpt ? (
                      <CardDescription>{article.excerpt}</CardDescription>
                    ) : null}
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default function ArticlesPage() {
  return (
    <RequireAuth>
      <ArticlesList />
    </RequireAuth>
  );
}
