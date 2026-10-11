const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    
    if (isValid(username)) {
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }

  } else {
    return res.status(404).json({message: "Please insert username and password"});
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    Promise.resolve(books)
      .then((bookList) => {
        res.send(JSON.stringify(bookList));
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  Promise.resolve(req.params.isbn)
    .then((isbn) => {
        res.status(200).json(books[isbn]);
    }).catch((error) => {
        res.status(500).send(error);
    })
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    Promise.resolve(req.params.author)
      .then((author) => {
        const parsedAuthor = author.replace(/-/g, " ");
  
        const matchingBooks = Object.values(books).filter((book) => {
          return book.author === parsedAuthor;
        });
  
        if (matchingBooks.length === 0) {
          return res.status(404).send("No books found for this author");
        }
  
        res.status(200).json(matchingBooks);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    Promise.resolve(req.params.title.replace(/-/g," "))
        .then((title) => {
            Object.values(books).forEach( book => {
                if (book.title === title) {
                    return res.status(200).json(book);
                }
            });
            res.status(404).send("No books found by such title");
        }).catch( error => {
            res.status(500).send(error);
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const ISBN = req.params.isbn;
    if (!ISBN) {
        return res.status(404).json({message: "ERROR."});
    }
    const book = books[ISBN];
    if (book) { 
        return res.status(200).json(book["reviews"]);
    }
    return res.status(404).json({message: "Book reviews not found by ISBN."});
});

module.exports.general = public_users;
