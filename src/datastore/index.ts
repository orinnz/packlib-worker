export interface DB_D1 {
  users: UsersTable;
  profiles: ProfileTable;
  articles: ArticlesTable;
  tags: TagsTable;
  article_tags: ArticleTagsTable;
}

export type UUID = `${string}-${string}-${string}-${string}-${string}`;

export interface BaseTable {
  id: UUID;
  created_at: string;
  updated_at: string;
}

export interface UsersTable extends BaseTable {
  username: string;
}

export interface ProfileTable extends BaseTable {
  user_id: UUID;
  age: number;
  gender: number;
}

export interface ArticlesTable extends BaseTable {
  slug: string;
  user_id: UUID;
  original_url: string;
  title: string;
  byline: string;
  excerpt: string;
  content_markdown: string;
  status: string;
}

export interface TagsTable extends BaseTable {
  name: string;
}

export interface ArticleTagsTable extends BaseTable {
  article_id: UUID;
  tag_id: UUID;
}


export function initDB_D1(env: Env) {
  if (!env.packlib_d1) {
    throw new Error("D1 database binding is missing");
  }
  return env.packlib_d1; // Return the native D1 database binding
}