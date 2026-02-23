import type { initDB_D1 } from "./datastore";

/**
 * AppContext defines the global type for your Hono application.
 * - Bindings: Environment variables and resources from wrangler.jsonc (D1, KV, etc.)
 * - Variables: Custom items added to the context by middleware (User, DB Pool, etc.)
 */
export type AppContext = {
  Bindings: Env;
  Variables: {
    d1?: ReturnType<typeof initDB_D1>;
  };
};

