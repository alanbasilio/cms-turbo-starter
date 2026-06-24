import { defineConfig } from "@kubb/core";
import { pluginClient } from "@kubb/plugin-client";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginReactQuery } from "@kubb/plugin-react-query";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

/**
 * The Strapi OpenAPI doc emits an invalid path key `/upload?id={id}` (a query
 * string baked into the path) for the "update file info" endpoint, because
 * OpenAPI can't model two `POST /upload` operations. kubb then generates a
 * client that references an undeclared `id` variable, which breaks typecheck.
 * The endpoint is unused, so we skip it across every plugin.
 */
const exclude = [{ type: "path" as const, pattern: /upload\?id/ }];

export default defineConfig({
  root: ".",
  input: {
    path: "../cms/src/extensions/documentation/documentation/1.0.0/full_documentation.json",
  },
  output: {
    path: "./src/generated",
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs({
      output: { path: "models" },
      exclude,
    }),
    pluginClient({
      output: { path: "clients" },
      exclude,
    }),
    pluginReactQuery({
      output: { path: "hooks" },
      exclude,
    }),
    pluginZod({
      output: { path: "zod" },
      exclude,
    }),
  ],
});
