import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook } from "../store/features/booksSlice";
import { showNotification } from "../store/features/notificationSlice";

const BookForm = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedTitle || !trimmedAuthor) {
      dispatch(
        showNotification({
          message: "Title and Author are required.",
          type: "error",
        })
      );
      return;
    }

    

    

    if (/\d/.test(trimmedAuthor)) {
      dispatch(showNotification({ message: "Author cannot contain numbers.", type: "error" }));
      return;
    }

    dispatch(addBook({ title: trimmedTitle, author: trimmedAuthor }));
    setTitle("");
    setAuthor("");
  };

  return (
    <div className="card p-4 mt-4">
      <h2 className="mb-4">Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">
            Author
          </label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Book
        </button>
      </form>
    </div>
  );
};

export default BookForm;
