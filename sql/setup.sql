-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists users;
drop table if exists secrets;

create table users (
  id bigint generated always as identity primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  password_hash text not null
);

create table secrets (
  id bigint generated always as identity,
  title text not null,
  description text not null,
  created_at timestamp with time zone default current_timestamp
);

insert into secrets
(title, description)
values
('Oatmeal', 'is better savory'),
('Hunger', 'is the best seasoning'),
('Atlas Shrugged', 'is terrible, just terrible');
