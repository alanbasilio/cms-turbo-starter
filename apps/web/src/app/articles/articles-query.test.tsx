import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
// Side-effect import: points the generated axios client at the BFF proxy.
import "@/src/lib/api-client";
import type { ReactNode } from "react";
import { useGetArticles } from "@/src/generated/hooks/useGetArticles";

const server = setupServer(
  http.get("*/api/strapi/articles", () =>
    HttpResponse.json({
      data: [
        { id: 1, documentId: "a1", title: "Primeiro artigo", slug: "primeiro" },
        { id: 2, documentId: "a2", title: "Segundo artigo", slug: "segundo" },
      ],
      meta: {},
    }),
  ),
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

function ArticleTitles() {
  const { data, isPending } = useGetArticles();
  if (isPending) return <p>Carregando...</p>;
  return (
    <ul>
      {data?.data?.map((article) => (
        <li key={article.documentId ?? article.slug}>{article.title}</li>
      ))}
    </ul>
  );
}

describe("useGetArticles through the BFF proxy", () => {
  it("fetches articles from /api/strapi/articles and renders them", async () => {
    render(<ArticleTitles />, { wrapper });

    await waitFor(() =>
      expect(screen.getByText("Primeiro artigo")).toBeInTheDocument(),
    );
    expect(screen.getByText("Segundo artigo")).toBeInTheDocument();
  });
});
