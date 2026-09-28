const express = require('express');
const books = require('./booksdb.js');

const books_api = express.Router();

// Internal data endpoints used by general.js so the required public
// retrieval routes can demonstrate Axios/Promise/async-await usage.
books_api.get('/books', (req, res) => {
  res.status(200).json(books);
});

books_api.get('/books/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book);
});

books_api.get('/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const result = Object.keys(books)
    .filter(isbn => books[isbn].author.toLowerCase() === author)
    .reduce((matches, isbn) => {
      matches[isbn] = books[isbn];
      return matches;
    }, {});

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }

  return res.status(200).json(result);
});

books_api.get('/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const result = Object.keys(books)
    .filter(isbn => books[isbn].title.toLowerCase() === title)
    .reduce((matches, isbn) => {
      matches[isbn] = books[isbn];
      return matches;
    }, {});

  if (Object.keys(result).length === 0) {
    return res.status(404).json({ message: "No books found for this title" });
  }

  return res.status(200).json(result);
});

module.exports.books_api = books_api;
