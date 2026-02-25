import type { CreateUserInput, UsersTable } from ".";

export async function insertUser(db: D1Database, input: CreateUserInput): Promise<void> {
  await db
    .prepare("INSERT INTO Users (email, username, role, full_name, avatar_url) VALUES (?, ?, ?, ?, ?)")
    .bind(input.email, input.username, input.role, input.full_name, input.avatar_url)
    .run();
}

export async function findUserByEmail(db: D1Database, email: string): Promise<UsersTable | null> {
  const user = await db.prepare("SELECT * FROM Users WHERE email = ?").bind(email).first<UsersTable>();
  return user;
}

export async function findAllUsers(db: D1Database): Promise<UsersTable[]> {
  const { results } = await db.prepare("SELECT * FROM Users").all<UsersTable>();
  return results;
}

export async function findUserById(db: D1Database, id: string): Promise<UsersTable | null> {
  const user = await db.prepare("SELECT * FROM Users WHERE Id = ?").bind(id).first<UsersTable>();
  return user;
}

export async function upsertUser(db: D1Database, input: CreateUserInput) {
  return db
    .prepare(
      `INSERT INTO users (id, email, username, role ,full_name, email_verified_at, avatar_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (email) DO UPDATE SET
         name = excluded.name,
         email_verified_at = CASE
           WHEN users.email_verified_at IS NULL THEN excluded.email_verified_at
           ELSE users.email_verified_at
         END,
         updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
       RETURNING *`,
    )
    .bind(input.id, input.email, input.username, input.role, input.full_name, input.avatar_url)
    .first<UsersTable>();
}
