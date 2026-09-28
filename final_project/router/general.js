const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BOOK_API_BASE = process.env.BOOK_API_BASE || "http://localhost:5000/api";

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop.
// Implemented with Axios + async/await as required by the assignment.
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${BOOK_API_BASE}/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to retrieve books" });
  }
});

// Get book details based on ISBN.
// Implemented with Axios + Promise callbacks.
public_users.get('/isbn/:isbn', (req, res) => {
  axios
    .get(`${BOOK_API_BASE}/books/isbn/${encodeURIComponent(req.params.isbn)}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => {
      const status = error.response ? error.response.status : 500;
      const data = error.response ? error.response.data : { message: "Unable to retrieve book" };
      return res.status(status).json(data);
    });
});

// Get book details based on author.
// Implemented with Axios + Promise callbacks.
public_users.get('/author/:author', (req, res) => {
  axios
    .get(`${BOOK_API_BASE}/books/author/${encodeURIComponent(req.params.author)}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => {
      const status = error.response ? error.response.status : 500;
      const data = error.response ? error.response.data : { message: "Unable to retrieve books" };
      return res.status(status).json(data);
    });
});

// Get all books based on title.
// Implemented with Axios + async/await.
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `${BOOK_API_BASE}/books/title/${encodeURIComponent(req.params.title)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const data = error.response ? error.response.data : { message: "Unable to retrieve books" };
    return res.status(status).json(data);
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
