import React from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

const Home = () => {
  const isLoggedIn = AuthService.isUserLoggedIn();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-8 col-md-10 mx-auto">
            <h1 className="fw-bold">Plan Your Perfect Wedding</h1>
            <p className="lead text-muted mt-3">
              From sending invitations to booking venues, our Wedding Manager app helps take the stress out of wedding planning.
            </p>
            <div className="mt-4">
              {isLoggedIn ? (
                <Link to="/weddings/123/dashboard" className="btn btn-primary btn-lg px-4 me-md-2">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-lg px-4 me-md-2">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline-secondary btn-lg px-4">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 section-title">Our Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-house-heart fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Venue Booking</h3>
                  <p className="card-text">
                    Discover and book the perfect venue for your special day from our curated selection.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-people fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Guest Management</h3>
                  <p className="card-text">
                    Easily manage your guest list, track RSVPs, and organize seating arrangements.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-check2-square fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Task Planning</h3>
                  <p className="card-text">
                    Keep track of all your wedding tasks with our intuitive task management system.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-shop fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Vendor Management</h3>
                  <p className="card-text">
                    Find and manage all your wedding vendors in one place, from caterers to photographers.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-wallet2 fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Budget Tracking</h3>
                  <p className="card-text">
                    Set your budget and track expenses to ensure you stay within your financial plan.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 text-center p-4">
                <div className="card-body">
                  <i className="bi bi-bell fs-1 text-primary mb-3"></i>
                  <h3 className="card-title">Reminders</h3>
                  <p className="card-text">
                    Never miss an important task with our reminder system that keeps you on schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 section-title">Happy Couples</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="text-warning">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <p className="card-text text-center">
                    "Wedding Manager made planning our wedding so much easier. We could keep track of everything in one place!"
                  </p>
                  <div className="text-center mt-4">
                    <h5 className="mb-0">John & Sarah</h5>
                    <small className="text-muted">Married June 2023</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="text-warning">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <p className="card-text text-center">
                    "The guest management feature was a lifesaver! We could easily track RSVPs and manage seating arrangements."
                  </p>
                  <div className="text-center mt-4">
                    <h5 className="mb-0">Michael & Emily</h5>
                    <small className="text-muted">Married August 2023</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    <div className="text-warning">
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                      <i className="bi bi-star-fill"></i>
                    </div>
                  </div>
                  <p className="card-text text-center">
                    "Being able to find vendors and venues all in one place saved us so much time and stress. Highly recommend!"
                  </p>
                  <div className="text-center mt-4">
                    <h5 className="mb-0">David & Jessica</h5>
                    <small className="text-muted">Married May 2023</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="mb-4">Ready to start planning your wedding?</h2>
          <p className="lead mb-4">Join thousands of happy couples who have used Wedding Manager to plan their perfect day.</p>
          {!isLoggedIn && (
            <Link to="/register" className="btn btn-light btn-lg px-4">
              Get Started Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home; 