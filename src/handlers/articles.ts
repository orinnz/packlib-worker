import { Hono } from "hono";
import type { AppContext } from "../fetch";
import { readArticle } from "../services/articles";
import { type } from "arktype";
import { validate } from "../hxxp/validator";

const app = new Hono<AppContext>();

const schemaCreateArticle = type({
  url: "string > 0",
});

app.post("/", validate("json", schemaCreateArticle), async (c) => {
  const body = c.req.valid("json");
  const article = await readArticle(body.url, c);
  return c.json({ data: { article } });
});

export { app as articles };