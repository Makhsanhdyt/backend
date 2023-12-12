/* eslint-disable object-curly-newline */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
// Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const { getAllCategories } = require('./src/categories/categoriesHandler');

// In-memory data store
const books = [];
const users = [];

// Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello Yobo!');
});

// get all book categories
app.get('/categories', getAllCategories);

// Fetch all books
app.get('/books', (req, res) => {
  res.json({
    status: true,
    message: 'Books fetched successfully',
    data: books.map((book) => ({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      images: book.images,
      imagem: book.imagem, // Update from "imagens"
      Imagel: book.Imagel, // Update from "Imagel"
    })),
  });
});

// Add book
app.post('/books', (req, res) => {
  const { isbn, title, author, publisher, images, imagem, Imagel } = req.body;
  const newBook = {
    isbn,
    title,
    author,
    publisher,
    images,
    imagem, // Update from "imagens"
    Imagel, // Update from "Imagel"
  };
  books.push(newBook);
  res.json({
    status: true,
    message: 'Book added successfully',
    data: newBook,
  });
});

// Update book
app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { isbn, title, author, publisher, images, imagem, Imagel } = req.body;
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      isbn,
      title,
      author,
      publisher,
      images,
      imagem, // Update from "imagens"
      Imagel, // Update from "Imagel"
    };
    res.json({
      status: true,
      message: 'Book updated successfully',
      data: books[bookIndex],
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'Book not found',
    });
  }
});

// Delete book
app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    res.json({
      status: true,
      message: 'Book deleted successfully',
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'Book not found',
    });
  }
});

// Get all user
app.get('/users', (req, res) => {
  res.json({
    status: true,
    message: 'Users fetched successfully',
    data: users,
  });
});

// Get specific user by ID:
app.get('/users/:userid', (req, res) => {
  const userId = req.params.userid;
  // eslint-disable-next-line no-shadow
  const user = users.find((user) => user.userid === userId);
  if (user) {
    res.json({
      status: true,
      message: 'User found',
      data: user,
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'User not found',
    });
  }
});

// Add new user
app.post('/users', (req, res) => {
  const { userid, location, age } = req.body;
  const newUser = {
    userid,
    location,
    age,
  };
  users.push(newUser);
  res.json({
    status: true,
    message: 'User added successfully',
    data: newUser,
  });
});

// Update user by ID
app.put('/users/:userid', (req, res) => {
  const userId = req.params.userid;
  const { location, age } = req.body;
  const userIndex = users.findIndex((user) => user.userid === userId);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      location: location || users[userIndex].location,
      age: age || users[userIndex].age,
    };
    res.json({
      status: true,
      message: 'User updated successfully',
      data: users[userIndex],
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'User not found',
    });
  }
});

// Delete user by ID
app.delete('/users/:userid', (req, res) => {
  const userId = req.params.userid;
  const userIndex = users.findIndex((user) => user.userid === userId);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.json({
      status: true,
      message: 'User deleted successfully',
    });
  } else {
    res.status(404).json({
      status: false,
      message: 'User not found',
    });
  }
});

// Add rating
app.post('/books/:isbn/rate', (req, res) => {
  const { isbn } = req.params;
  const { userid, rating } = req.body;

  // Check if user and book exist
  const user = users.find((user) => user.userid === userid);
  const book = books.find((book) => book.isbn === isbn);

  if (!user || !book) {
    res.status(404).json({
      status: false,
      message: 'User or book not found',
    });
    return;
  }

  // Add user rating to book
  book.rating.userRatings.push({
    userid,
    rating,
  });

  // Update average and count
  book.rating.average = calculateAverageRating(book.rating.userRatings);
  book.rating.count = book.rating.userRatings.length;

  res.json({
    status: true,
    message: 'Rating added successfully',
  });
});
// Start server
const PORT = process.env.PORT || 8000;
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
