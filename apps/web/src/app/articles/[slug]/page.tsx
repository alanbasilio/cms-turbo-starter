"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { RequireAuth } from "@/src/components/require-auth";
import { Button } from "@/src/components/ui/button";
import { useGetArticles } from "@/src/generated/hooks/useGetArticles";

function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();

  // Strapi has no by-slug endpoint, so query the list filtered to one slug.
  const { data, isPending, isError } = useGetArticles(
    { filters: { slug: { $eq: slug } } },
    { query: { enabled: Boolean(slug) } },
  );

  const article = data?.data?.[0];

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <Button asChild variant="outline" size="sm" className="self-start">
        <Link href="/articles">← Artigos</Link>
      </Button>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Carregando...</p>
      ) : isError ? (
        <p className="text-sm text-destructive" role="alert">
          Não foi possível carregar o artigo.
        </p>
      ) : !article ? (
        <p className="text-sm text-muted-foreground">Artigo não encontrado.</p>
      ) : (
        <article className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{article.title}</h1>
          {article.content ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {article.content}
            </div>
          ) : null}
        </article>
      )}
    </main>
  );
}

export default function ArticlePage() {
  return (
    <RequireAuth>
      <ArticleDetail />
    </RequireAuth>
  );
}
