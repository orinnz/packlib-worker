import { Hono } from "hono";
import type { AppContext } from "../fetch";
import { middlewareJWT } from "./auth";

const app = new Hono<AppContext>();

app.get("/me", middlewareJWT, async (c) => {
  const jwt = c.get("jwtPayload");
  console.log("jwt", jwt);
  return c.json({ user: jwt });
});

export { app as user };
