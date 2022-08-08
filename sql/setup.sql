-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists users;

create table users (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  password_hash text not null
);