import type { CreateUserInput, UsersTable } from ".";

export async function insertUser(db: D1Database, input: CreateUserInput): Promise<void> {
  await db.prepare("INSERT INTO Users (Username, Password) VALUES (?, ?)").bind(input.username, input.password).run();
}

export async function findUserByUsername(db: D1Database, username: string): Promise<UsersTable | null> {
  const user = await db.prepare("SELECT * FROM Users WHERE Username = ?").bind(username).first<UsersTable>();
  return user;
}

export async function updateUser(db: D1Database, input: CreateUserInput): Promise<void> {
  await db
    .prepare("UPDATE Users SET Username = ?, Password = ? WHERE Username = ?")
    .bind(input.username, input.password, input.username)
    .run();
}
