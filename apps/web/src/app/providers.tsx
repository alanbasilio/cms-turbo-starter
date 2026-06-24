"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { AuthProvider } from "@/src/components/auth-provider";
// Side-effect import: configures the axios baseURL and auth interceptor.
import "@/src/lib/api-client";

// Bump automatically on every release; falls back to a static value in dev.
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.1.0";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want a staleTime above 0 to avoid
        // refetching immediately on the client after hydration.
        staleTime: 60 * 1000,
        // Persistence only restores queries that are still within gcTime,
        // so it must be long enough to outlive a page reload.
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client per request.
    return makeQueryClient();
  }
  // Browser: keep a singleton so we don't recreate the client on
  // re-render or when React suspends during the initial render.
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

let browserPersister: ReturnType<typeof createSyncStoragePersister> | undefined;

function getPersister() {
  // Singleton: localStorage is only available in the browser.
  if (!browserPersister) {
    browserPersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "cms-turbo-query-cache",
    });
  }
  return browserPersister;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // On the server there is no localStorage, so fall back to the plain
  // provider. The browser render swaps in the persisting provider.
  if (typeof window === "undefined") {
    return (
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: getPersister(),
        // Invalidate the persisted cache whenever the app version changes,
        // so a deploy that alters the data shape never restores stale data.
        buster: APP_VERSION,
        // Only persist queries that actually have data, skipping pending /
        // errored ones that aren't worth restoring after a reload.
        dehydrateOptions: {
          shouldDehydrateQuery: (query) =>
            query.state.status === "success" &&
            defaultShouldDehydrateQuery(query),
        },
      }}
    >
      <AuthProvider>{children}</AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
}
