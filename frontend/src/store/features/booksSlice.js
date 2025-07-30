import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

// Fetch books with optional search and pagination
export const getBooks = createAsyncThunk(
  "books/getBooks",
  async ({ keyword = "", page = 1, limit = 10 }) => {
    const response = await axiosInstance.get(
      `/books?keyword=${keyword}&page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

// Add a new book
export const addBook = createAsyncThunk("books/addBook", async (bookData) => {
  const response = await axiosInstance.post("/books", bookData);
  return response.data;
});

// Books slice to manage book-related state
const booksSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    status: "idle",
    error: null,
    page: 1,
    pages: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch books async states
      .addCase(getBooks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.books = action.payload.books;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addBook.fulfilled, (state, action) => {
        state.books.unshift(action.payload);
      });
  },
});

export default booksSlice.reducer;
