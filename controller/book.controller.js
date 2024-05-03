const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const Book = require('../models/books');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user });
    const booksWithoutUserId = books.map(book => {
        const { userId: _, ...bookWithoutUserId } = book.toObject();
        return bookWithoutUserId;
      });
  
    res.json(booksWithoutUserId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBook = async (req, res) => {
  const { title, author, publicationYear } = req.body;
  const userId = req.user;
  const imageName = req.file ? req.file.filename : null; 
  
  try {
    const newBook = await Book.create({ title, author, publicationYear, userId, imageName });
    const { userId: _, ...bookWithoutUserId } = newBook.toObject();
    res.status(201).json(bookWithoutUserId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.userId != req.user) {
        return res.status(403).json({ message: 'Unauthorized: Book does not belong to the user' });
      }
    const { userId: _, ...bookWithoutUserId } = book.toObject();
    res.json(bookWithoutUserId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  const { title, author, publicationYear } = req.body;
  const imageName = req.file ? req.file.filename : null; 
  
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.userId != req.user) {
        return res.status(403).json({ message: 'Unauthorized: Book does not belong to the user' });
      }
    book.title = title;
    book.author = author;
    book.publicationYear = publicationYear;
    if (imageName) {
      book.imageName = imageName;
    }
    await book.save();
    const { userId: _, ...bookWithoutUserId } = book.toObject();
    res.json(bookWithoutUserId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.userId != req.user) {
        return res.status(403).json({ message: 'Unauthorized: Book does not belong to the user' });
      }
    if (book.imageName) {
      fs.unlinkSync(path.join(__dirname, '../uploads/', book.imageName));
    }
    await book.remove();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.filterBooks = async (req, res) => {
    const { author, publicationYear } = req.query;
    const filter = {};
  
    if (author) {
      filter.author = author;
    }
  
    if (publicationYear) {
      filter.publicationYear = publicationYear;
    }
  
    try {
        const userId = req.user
        const books = await Book.find({ ...filter, userId });
        const booksWithoutUserId = books.map(book => {
            const { userId: _, ...bookWithoutUserId } = book.toObject();
            return bookWithoutUserId;
          });
      
        res.json(booksWithoutUserId);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};