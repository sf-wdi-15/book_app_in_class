# Postgres
## Node Postgres


### Setup

We already have a working application on external repository. We are going to refactor to add postgres.

see [book_app_in_class](https://github.com/sf-wdi-15/book_app_in_class)

Let's setup a database to persist our books so we can save records to it instead of an array.

`schema.sql`

```
CREATE DATABASE book_app;

\c book_app

CREATE TABLE books (
		id serial primary key,
		title text,
		author text
	);

INSERT INTO books (title, author)
	VALUES ('The Great Gatsby', 'F.S. Fitzgerald');

INSERT INTO books (title, author)
	VALUES ('The Giver', 'Lois Lowry');
```

If we run this

```
$ psql -f schema.sql
```

We have now setup our database with the same info we had in the array with book objects. We are now ready to refactor our application.