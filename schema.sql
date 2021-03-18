-- Postgresql

CREATE TABLE products (
  id serial primary key
);

CREATE TABLE questions (
  id serial primary key,
  question_body varchar(1000) NOT NULL,
  question_date date default current_timestamp,
  asker_name varchar(60) NOT NULL,
  asker_email varchar(60) NOT NULL,
  question_helpfulness integer NOT NULL default 0,
  reported boolean default false,
  product_id integer references products(id) ON DELETE CASCADE
);

CREATE TABLE answers (
  id serial primary key,
  answer_body varchar(1000) NOT NULL,
  created_at date default current_timestamp,
  answerer_name varchar(60) NOT NULL,
  answerer_email varchar(60) NOT NULL,
  helpfulness integer default 0,
  reported boolean default false,
  question_id integer references questions(id) ON DELETE CASCADE
);

CREATE TABLE photos (
  id serial primary key,
  url varchar(250) NOT NULL,
  answer_id integer references answers(id) ON DELETE CASCADE

);