-- Migration number: 0002 	 2026-02-25T04:06:22.122Z
alter table users add column role text default "user";
alter table users add column full_name text;