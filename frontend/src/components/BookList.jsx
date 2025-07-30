/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBooks } from "../store/features/booksSlice";
import useDebounce from "../hooks/useDebounce";
import CircularProgress from "@mui/material/CircularProgress";

const BookList = () => {
  const dispatch = useDispatch();
  const { books, status, error, page, pages } = useSelector(
    (state) => state.books
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getBooks({ keyword: debouncedSearchTerm, page: currentPage }));
  }, [dispatch, debouncedSearchTerm, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    dispatch(getBooks({ keyword: searchTerm, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="card p-4">
      <h2 className="mb-4">Book List</h2>
      <form onSubmit={handleSearch} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="btn btn-outline-secondary" type="submit">
            Search
          </button>
        </div>
      </form>

      {status === "loading" ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100px" }}
        >
          <CircularProgress />
        </div>
      ) : status === "failed" ? (
        <div className="alert alert-danger">Error: {error}</div>
      ) : books.length === 0 ? (
        <p>No books available.</p>
      ) : (
        <ul className="list-group mb-3">
          {books.map((book) => (
            <li key={book._id} className="list-group-item">
              <strong>{book.title}</strong> by {book.author}
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(pages).keys()].map((x) => (
              <li
                key={x + 1}
                className={`page-item ${x + 1 === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(x + 1)}
                >
                  {x + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === pages ? "disabled" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default BookList;
