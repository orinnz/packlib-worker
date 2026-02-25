import type { UUID } from "node:crypto";
import type { CreateUserInput, UsersTable } from "../datastore";
import { findAllUsers, findUserByEmail, findUserById, insertUser, upsertUser } from "../datastore/users";
import type { schemaIDTokenGoogle } from "../handlers/auth";
import { uuidV7 } from "../utils/uuid";

export async function getAllUsers(db: D1Database) {
  return findAllUsers(db);
}

export async function getUserById(db: D1Database, id: string) {
  return findUserById(db, id);
}

export async function createUser(db: D1Database, input: CreateUserInput) {
  return insertUser(db, input);
}

export async function findOrCreateUser(db: D1Database, idToken: typeof schemaIDTokenGoogle.infer) {
  let user = await findUserByEmail(db, idToken.email);
  if (user) {
    if (user.email_verified_at) {
      return [user, false] as const;
    }
    if (!idToken.email_verified) {
      return [user, false] as const;
    }
  }

  const id = uuidV7();
  user = await upsertUser(db, {
    id,
    email: idToken.email,
    username: idToken.name,
    role: "user",
    full_name: idToken.name,
    avatar_url: idToken.picture ?? undefined,
    email_verified_at: idToken.email_verified ? new Date().toISOString() : undefined,
  });

  const registering = id === user?.id;
  return [user, registering] as const;
}

export type JWTPayload = {
  iss: string;
  jti: string;
  sub: UUID;
  iat: number;
  nbf: number;
  exp: number;
  name: string;
  username: string | null;
};

export function generateJWTPayload(user: Pick<UsersTable, "id" | "username" | "full_name">): JWTPayload {
  const iat = Math.floor(Date.now() / 1000);
  const jti = uuidV7();

  return {
    iss: "packlib",
    jti,
    sub: user.id,
    iat,
    nbf: iat,
    exp: iat + 60 * 60 * 24,
    name: user.full_name,
    username: user.username,
  };
}
