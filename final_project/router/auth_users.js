const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.find((user) =>  user.username === username);
    // Return true if any user with the same username is found, otherwise false
    if (typeof userswithsamename !== "undefined") {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let existingUser = users.find((user) => (user.username === username && user.password === password));
    if (typeof existingUser !== "undefined") {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const usern = req.body.username;
  const passw = req.body.password;
  if (passw && usern) {
    
    if (authenticatedUser(usern, passw)) {
        let accessToken = jwt.sign({
            data: usern
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {accessToken};

        return res.status(200).json({message: "User successfully logged in."});
    } else {
        return res.status(404).json({message: "Login ERROR: Please try again."});
    }

  } else {
    return res.status(404).json({message: "Please insert username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

  const username = req.user["data"];
  const review = req.body.review;
  const ISBN = req.params.isbn;
  let book = books[ISBN];

  if (typeof book !== "undefined") {

    let reviews = book["reviews"];
    reviews[username] = review;
    return res.status(200).json({message: "Review added successfully"});

  } else {
    return res.status(404).json({message: "Book by ISBN not found, please try again."});
  }
}
);

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.user["data"];
  const ISBN = req.params.isbn;
  let book = books[ISBN];
  if (typeof book !== "undefined") {

    let reviews = book["reviews"];
    delete reviews[username];
    return res.status(200).json({message: "Review removed successfully"});

  } else {
    return res.status(404).json({message: "Book by ISBN not found, please try again."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
