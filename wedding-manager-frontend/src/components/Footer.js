import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="text-uppercase mb-3">Wedding Manager</h5>
            <p className="small">
              A comprehensive wedding management application to help couples plan their perfect wedding day with ease.
            </p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5 className="text-uppercase mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-white text-decoration-none">Home</Link>
              </li>
              <li>
                <Link to="/venues" className="text-white text-decoration-none">Venues</Link>
              </li>
              <li>
                <Link to="/register" className="text-white text-decoration-none">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-white text-decoration-none">Login</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5 className="text-uppercase mb-3">Contact</h5>
            <p className="small mb-0">
              <i className="bi bi-envelope me-2"></i>
              info@weddingmanager.com
            </p>
            <p className="small mb-0">
              <i className="bi bi-telephone me-2"></i>
              +1 (123) 456-7890
            </p>
            <div className="mt-3">
              <a href="#" className="text-white me-3 fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-white me-3 fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-white me-3 fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-white me-3 fs-5">
                <i className="bi bi-pinterest"></i>
              </a>
            </div>
          </div>
        </div>
        <hr className="my-3 bg-light" />
        <div className="text-center small">
          &copy; {new Date().getFullYear()} Wedding Manager. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 