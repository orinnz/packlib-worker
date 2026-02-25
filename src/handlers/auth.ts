import { type } from "arktype";
import { Hono } from "hono";
import { getConnInfo } from "hono/cloudflare-workers";
import { sign, verifyWithJwks } from "hono/jwt";
import type { AppContext } from "../fetch";
import { AppError } from "../hxxp/error";
import { validate, validateOrThrow } from "../hxxp/validator";
import { generateJWTPayload, signInOrSignUpWithGoogle } from "../services/user";

const app = new Hono<AppContext>();

const schemaLoginWithGoogle = type({
  id_token: "string > 0",
});

export const schemaIDTokenGoogle = type({
  aud: "string",
  sub: "string",
  email: "string",
  email_verified: "boolean",
  name: "string",
  jti: "string",
  picture: "string?",
});

app.post("/google", validate("json", schemaLoginWithGoogle), async (c) => {
  const body = c.req.valid("json");

  const idTokenRaw = await verifyWithJwks(
    body.id_token,
    {
      jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
      verification: {
        iss: "https://accounts.google.com",
        iat: true,
        exp: true,
        nbf: true,
        aud: c.env.GSI_ID,
      },
      allowedAlgorithms: ["RS256"],
    },
    {
      cf: {
        cacheTtlByStatus: {
          "200-299": 60 * 60 * 24,
        },
      },
    },
  );

  const idToken = validateOrThrow(schemaIDTokenGoogle, idTokenRaw);
  if (idToken.aud !== c.env.GSI_ID) {
    throw new AppError("Validation", "Invalid token audience");
  }

  if (!idToken.email_verified) {
    throw new AppError("Validation", "Unverified email");
  }

  const d1 = c.get("d1");
  if (!d1) {
    throw new AppError("Service", "No database connection");
  }

  const info = getConnInfo(c);

  console.log("info");

  const user = await signInOrSignUpWithGoogle(
    c.executionCtx,
    c.env,
    d1,
    idToken,
    {
      ua: c.req.header("User-Agent"),
      device: c.req.header("CF-Device-Type"),
      asn: c.req.raw.cf?.asn,
      asOrganization: c.req.raw.cf?.asOrganization,
      country: c.req.raw.cf?.country,
      city: c.req.raw.cf?.city,
      region: c.req.raw.cf?.region,
      timezone: c.req.raw.cf?.timezone,
      colo: c.req.raw.cf?.colo,
      bot_score:
        typeof c.req.raw.cf?.botManagement === "object" &&
        c.req.raw.cf?.botManagement !== null &&
        "score" in c.req.raw.cf.botManagement
          ? c.req.raw.cf?.botManagement?.score
          : undefined,
    },
    info.remote.address,
  );

  if (!user) {
    throw new AppError("Service", "User not found");
  }

  const payload = generateJWTPayload(user);
  const signature = await sign(payload, c.env.JWT_PRIVATE_KEY, "EdDSA");

  return c.json({
    data: {
      claims: payload,
      jwt: signature,
    },
  });
});
