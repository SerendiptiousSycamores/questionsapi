-- Postgresql
CREATE DATABASE questions;

CREATE TABLE questions (
  id integer NOT NULL PRIMARY KEY,
  question_body varchar(1000) NOT NULL,
  question_date date NOT NULL,
  asker_name varchar(60) NOT NULL,
  question_helpfulness integer NOT NULL,
  reported boolean NOT NULL,
);

CREATE TABLE questionsToAnswers (
  question_id integer references questions(id),
  answer_id integer references answers(id)
);

CREATE TABLE answers (
  id integer NOT NULL PRIMARY KEY,
  answer_body varchar(1000) NOT NULL,
  created_at date NOT NULL,
  answerer_name varchar(60) NOT NULL,
  helpfulness integer NOT NULL,
  reported boolean NOT NULL,
);

CREATE TABLE answersToPhotos (
  answer_id integer references answers(id) ,
  photo_id integer references photos(id)
);

CREATE TABLE photos (
  id integer NOT NULL PRIMARY KEY,
  photo bytea

);