import React from 'react';
import BookList from '../components/BookList';
import BookForm from '../components/BookForm';

const Home = () => {
  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Book Manager</h1>
      <div className="row">
        <div className="col-md-6">
          <BookList />
        </div>
        <div className="col-md-6">
          <BookForm />
        </div>
      </div>
    </div>
  );
};

export default Home;
