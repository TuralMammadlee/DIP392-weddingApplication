import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1 text-primary mb-4">404</h1>
      <h2 className="display-4 mb-4">Page Not Found</h2>
      <p className="lead mb-5">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link to="/" className="btn btn-primary btn-lg px-5 py-3 rounded-pill">
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound; 