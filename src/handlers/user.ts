import { Hono } from "hono";
import { findUserById } from "../datastore/users";
import type { AppContext } from "../fetch";
import { middlewareJWT } from "./auth";

const app = new Hono<AppContext>();

app.get("/me", middlewareJWT, async (c) => {
  const jwt = c.get("jwtPayload");
  const user = await findUserById(c.get("d1"), jwt.sub);
  return c.json({ user });
});

export { app as user };
