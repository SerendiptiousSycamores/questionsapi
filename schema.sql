-- Postgresql
CREATE DATABASE questions;

CREATE TABLE products (
  id integer NOT NULL PRIMARY KEY CASCADE,
);

CREATE TABLE questions (
  id integer NOT NULL PRIMARY KEY CASCADE,
  question_body varchar(1000) NOT NULL,
  question_date date NOT NULL,
  asker_name varchar(60) NOT NULL,
  question_helpfulness integer NOT NULL,
  reported boolean NOT NULL,
  product_id integer NOT NULL references products(id)
);

CREATE TABLE answers (
  id integer NOT NULL PRIMARY KEY CASCADE,
  answer_body varchar(1000) NOT NULL,
  created_at date NOT NULL,
  answerer_name varchar(60) NOT NULL,
  helpfulness integer NOT NULL,
  reported boolean NOT NULL,
  question_id integer NOT NULL references questions(id)
);

CREATE TABLE photos (
  id integer NOT NULL PRIMARY KEY,
  photo bytea,
  answer_id integer NOT NULL references answers(id)

);