 /* 
  require the usual modules
*/
var express = require("express"),
  bodyParser = require("body-parser"),
  methodOverride = require("method-override"),
  pg = require("pg"),
  app = express();


/*
  setup the application middleware

  bodyParser for parsing form data
    on POST-ed form submissions

  methodOverride for faking request
    types not supported by the
    browser
  
  ejs set as the default view 
    engine
*/

/*
  extended true parses the nested  
   form names, i.e. 
    book[title]: ..., book[author]: ...
    becomes
    book: {title: ..., author: ...}
*/
app.use(bodyParser.urlencoded({extended: true}));
/*
  override incoming requests like
    POST /books/1?_method=DELETE
    to match a app.delete("/books", ...)
*/
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

var bookCount = 2;
var books = [
              {
                id: 1,
                title: "The Great Gatsby",
                author: "F.S. Fitzgerald"
              },
              {
                id: 2,
                title: "The Giver",
                author: "Lois Lowry"
              },
            ];

var config = require("./config.json");

var db = {};

db.connect = function (action){
  pg.connect(config, action);

 };


db.query = function (statement, params, action) {
   db.connect(function(err, client, done){
      if (err) {
           console.error("OOOPS!!! SOMETHING WENT WRONG!", err);
      }
      client.query(statement, params, action);
      done();
  });
};

app.get("/books", function (req, res) {
  db.query("SELECT * FROM books", [], function (err, result) {
    console.log(result.rows);  
    res.render("books/index", {bookList: result.rows});         
  });
});


app.get("/books/new", function (req, res) {
  res.render("books/new");
});

app.get("/books/:id", function (req, res) {

  db.query("SELECT * FROM books WHERE id=$1", [req.params.id], function (err, result) {
            console.log(result.rows);
          if (result.rows.length) {
            res.render("books/show", {book: result.rows[0]});
          } else {
            // read about this http://expressjs.com/api.html#res.status
            res.status(404).send("Book Not Found");
          }      
  });

});

app.post("/books", function (req, res) {
  var newBook = req.body.book;
  db.query("INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *", [newBook.title, newBook.author], function (err, result) {

        console.log(result.rows);  
        var book = result.rows[0];   
        res.redirect("/books/" + book.id);      
  });
});


app.delete("/books/:id", function (req, res) {
  var bookId = parseInt(req.params.id);
  var bookIndex = null;
  for (var i = 0, notFound = true; i < books.length && notFound; i+=1) {
    if (books[i].id == bookId) {
      notFound = false;
      bookIndex = i;
    }
  }
  if (notFound) {
    res.send(404).send("Book Not Found");
  } else {
    books.splice(bookIndex, 1);
    res.redirect("/books");
  }
})
// Site Routes

// root path
app.get("/", function (req, res) {
  res.render("sites/index");
});


// don't forget to listen
app.listen(3000, function () {
  console.log(new Array(51).join("*"));
  console.log("\t LISTENING ON: \n\t\t localhost:3000");
  console.log(new Array(51).join("*")); 
});


