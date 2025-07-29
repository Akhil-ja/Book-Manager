import Book from "../models/Book.js";

export const getAllBooks = async (keyword = "", page = 1, limit = 10) => {
  const skip = (page - 1) * limit; // Calculate how many docs to skip for pagination

  // Build search query to match title or author by keyword
  const query = keyword
    ? {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { author: { $regex: keyword, $options: "i" } },
        ],
      }
    : {};

  // Get paginated list of books matching query
  const books = await Book.find(query).limit(limit).skip(skip);

  // Count total documents
  const count = await Book.countDocuments(query);

  return {
    books,
    page,
    pages: Math.ceil(count / limit), // Total pages based on count and limit
  };
};

export const createBook = async (title, author) => {
  const book = new Book({
    title,
    author,
  });

  const createdBook = await book.save();
  return createdBook;
};
