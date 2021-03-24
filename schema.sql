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

CREATE UNIQUE INDEX sortproductid on products(id);
CREATE INDEX helpful_index_desc on questions(question_helpfulness DESC);
CREATE INDEX question_not_reported on questions(id) where reported is not true;
CREATE INDEX questionDate on questions(question_date DESC);
CREATE INDEX questionId on questions(id);
CREATE INDEX search_by_productid on questions(product_id) INCLUDE (id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported);

CREATE INDEX answerDate on answers(created_at DESC);
CREATE INDEX answerId on answers(id);
CREATE INDEX answersHelpful_index on answers(helpfulness DESC);
CREATE INDEX search_by_questionid ON answers(question_id) INCLUDE (id, answer_body, created_at, answerer_name, answerer_email, helpfulness, reported);

CREATE UNIQUE INDEX photoId on photos(id);
CREATE INDEX search_by_answerid on photos(answer_id) INCLUDE (id,url);