import { getAllBooks, createBook } from "../services/bookService.js";
import STATUS_CODES from "../utils/statusCodes.js";

// @desc    Fetch all books
// @route   GET /api/books
// @access  Public
export const getBooksController = async (req, res) => {
  const keyword = req.query.keyword; // Optional search keyword
  const page = parseInt(req.query.page) || 1; // Current page number, default 1
  const limit = parseInt(req.query.limit) || 10; // Number of items per page, default 10

  try {
    const {
      books,
      page: currentPage,
      pages,
    } = await getAllBooks(keyword, page, limit);

    res.json({ books, page: currentPage, pages });
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Public
export const createBookController = async (req, res) => {
  const { title, author } = req.body;

  try {
    // Create new book using service
    const createdBook = await createBook(title, author);

    res.status(STATUS_CODES.CREATED).json(createdBook);
  } catch (error) {
    res.status(STATUS_CODES.BAD_REQUEST).json({ message: error.message });
  }
};
