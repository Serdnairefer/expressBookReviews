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
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if (!ISBN) {
    return res.status(404).json({message: "ERROR."});
  }
  return res.status(200).json(books[ISBN]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.replace(/-/g," ");
  console.log(author);
  if (!author) {
    return res.status(404).json({message: "ERROR"});
  }
  Object.values(books).forEach( book => {
    if (book.author === author) {
        return res.status(200).json(book);
    }
  })
  return res.status(404).json({message: "Book by author not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.replace(/-/g," ");
    console.log(title);
    if (!title) {
        return res.status(404).json({message: "ERROR"});
    }
    Object.values(books).forEach( book => {
        if (book.title === title) {
            return res.status(200).json(book);
        }
    })
    return res.status(404).json({message: "Book by title not found"});
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
