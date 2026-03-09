import { Hono } from "hono";
import { cors } from "hono/cors";
import { initDB_D1 } from "./datastore";
import { auth } from "./handlers/auth";
import { user } from "./handlers/user";
import { articles } from "./handlers/articles";

export type AppContext = {
  Bindings: Env;
  Variables: {
    d1: ReturnType<typeof initDB_D1>;
  };
};

declare module "hono" {
  interface ExecutionContext {
    readonly exports: Cloudflare.Exports;
  }
}

const app = new Hono<AppContext>();

app.options("*", async (c, next) => {
  await next();
  c.header("Cache-Control", "public, max-age=3600");
  c.header("Vary", "Origin");
});

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    maxAge: 3600,
  }),
);

app.use(async (c, next) => {
  const d1 = initDB_D1(c.env);
  c.set("d1", d1);
  await next();
});

app.route("/api/auth", auth);
app.route("/api/user", user);
app.route("/api/articles", articles);
app.get("/ping", (c) => {
  return c.text("pong");
});

export { app };
