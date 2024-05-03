const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/auth');
const BookController = require('../controllers/BookController');

router.get('/', authenticateToken, BookController.getAllBooks);
router.post('/', authenticateToken, BookController.createBook);
router.get('/:id', authenticateToken, BookController.getBookById);
router.put('/:id', authenticateToken, BookController.updateBook);
router.delete('/:id', authenticateToken, BookController.deleteBook);
router.get('/filter/books', authenticateToken, BookController.filterBooks);

module.exports = router;