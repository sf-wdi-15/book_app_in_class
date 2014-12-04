CREATE DATABASE example_app;

\c example_app

CREATE TABLE person (
      id serial primary key,
      name text,
      age integer
    );

INSERT INTO person ( name, age)
      VALUES ('Zed', 37);
\d+ person