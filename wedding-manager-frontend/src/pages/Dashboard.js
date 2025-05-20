import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthService from '../services/auth.service';
import { taskService } from '../services/api';

const Dashboard = () => {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id: weddingId } = useParams();

  useEffect(() => {
    // Check if user is logged in
    if (!AuthService.isUserLoggedIn()) {
      navigate('/login');
      return;
    }

    // Mock data for now - would be fetched from API in a real application
    const mockData = {
      id: weddingId, // Use the ID from URL params
      coupleName: 'Jessica & Michael',
      weddingDate: '2024-08-15',
      daysRemaining: 112,
      venue: {
        name: 'Crystal Garden Resort',
        confirmed: true
      },
      guests: {
        total: 150,
        confirmed: 82,
        declined: 18,
        pending: 50
      },
      tasks: {
        total: 42,
        completed: 25,
        upcoming: 8,
        overdue: 2
      },
      budget: {
        total: 25000,
        spent: 14500,
        remaining: 10500
      },
      vendors: {
        total: 10,
        confirmed: 7
      },
      recentActivity: [
        { id: 1, type: 'task', message: 'Booked floral arrangements', date: '2023-04-12' },
        { id: 2, type: 'guest', message: 'The Johnsons confirmed attendance', date: '2023-04-10' },
        { id: 3, type: 'vendor', message: 'Photographer contract signed', date: '2023-04-08' },
        { id: 4, type: 'task', message: 'Cake tasting scheduled', date: '2023-04-05' }
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setWeddingData(mockData);
      setLoading(false);
    }, 800);
  }, [navigate, weddingId]);

  const handleAddTask = async () => {
    try {
      navigate(`/weddings/${weddingId}/tasks/new`);
    } catch (err) {
      console.error('Error navigating to add task:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your wedding dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/" className="btn btn-primary">Go to Home</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="display-5 fw-bold">Welcome, {weddingData.coupleName}!</h1>
          <p className="lead">
            Your wedding is in <span className="fw-bold text-primary">{weddingData.daysRemaining} days</span> on {new Date(weddingData.weddingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="col-md-4 d-flex justify-content-md-end align-items-center">
          <Link to={`/weddings/${weddingId}/edit`} className="btn btn-outline-primary me-2">
            <i className="bi bi-pencil-square"></i> Edit Wedding
          </Link>
          <Link to={`/weddings/${weddingId}/checklist`} className="btn btn-primary">
            <i className="bi bi-list-check"></i> Checklist
          </Link>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Guests</h5>
              <h2 className="display-6 fw-bold">{weddingData.guests.confirmed}/{weddingData.guests.total}</h2>
              <p className="card-text text-muted">Confirmed</p>
              <Link to={`/weddings/${weddingId}/guests`} className="btn btn-sm btn-outline-primary">Manage Guests</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Tasks</h5>
              <h2 className="display-6 fw-bold">{weddingData.tasks.completed}/{weddingData.tasks.total}</h2>
              <p className="card-text text-muted">Completed</p>
              <Link to={`/weddings/${weddingId}/tasks`} className="btn btn-sm btn-outline-primary">Manage Tasks</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Budget</h5>
              <h2 className="display-6 fw-bold">${weddingData.budget.spent.toLocaleString()}</h2>
              <p className="card-text text-muted">of ${weddingData.budget.total.toLocaleString()}</p>
              <Link to={`/weddings/${weddingId}/budget`} className="btn btn-sm btn-outline-primary">Manage Budget</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Vendors</h5>
              <h2 className="display-6 fw-bold">{weddingData.vendors.confirmed}/{weddingData.vendors.total}</h2>
              <p className="card-text text-muted">Confirmed</p>
              <Link to={`/weddings/${weddingId}/vendors`} className="btn btn-sm btn-outline-primary">Manage Vendors</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="row">
        {/* Left Column - Venue */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Venue</h5>
              <Link to="/venues" className="btn btn-sm btn-link">View All</Link>
            </div>
            <div className="card-body">
              {weddingData.venue.confirmed ? (
                <>
                  <h5 className="card-title">{weddingData.venue.name}</h5>
                  <div className="mb-2">
                    <span className="badge bg-success me-2">Confirmed</span>
                  </div>
                  <p className="card-text text-muted">123 Wedding Lane, Cityville, State</p>
                  <div className="mt-3">
                    <button className="btn btn-sm btn-outline-primary me-2">Contact</button>
                    <button className="btn btn-sm btn-outline-secondary">Details</button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-building fs-1 text-muted"></i>
                  <p className="mt-3">No venue selected yet</p>
                  <Link to="/venues/browse" className="btn btn-primary">Find Venues</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column - Tasks */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Upcoming Tasks</h5>
              <Link to={`/weddings/${weddingId}/tasks`} className="btn btn-sm btn-link">View All</Link>
            </div>
            <div className="card-body">
              {weddingData.tasks.upcoming > 0 ? (
                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0 py-2 border-0">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="task1" />
                      <label className="form-check-label" htmlFor="task1">
                        <span className="fw-medium">Send invitations</span>
                        <span className="d-block small text-muted">Due in 7 days</span>
                      </label>
                    </div>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="task2" />
                      <label className="form-check-label" htmlFor="task2">
                        <span className="fw-medium">Finalize menu selections</span>
                        <span className="d-block small text-muted">Due in 14 days</span>
                      </label>
                    </div>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="task3" />
                      <label className="form-check-label" htmlFor="task3">
                        <span className="fw-medium">Book hair and makeup trial</span>
                        <span className="d-block small text-muted">Due in 21 days</span>
                      </label>
                    </div>
                  </li>
                  <li className="list-group-item px-0 py-2 border-0">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="task4" />
                      <label className="form-check-label" htmlFor="task4">
                        <span className="fw-medium">Order wedding favors</span>
                        <span className="d-block small text-danger">Overdue by 2 days</span>
                      </label>
                    </div>
                  </li>
                </ul>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check2-circle fs-1 text-success"></i>
                  <p className="mt-3">All caught up! No upcoming tasks.</p>
                </div>
              )}
            </div>
            <div className="card-footer bg-white">
              <button onClick={handleAddTask} className="btn btn-sm btn-primary">Add New Task</button>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {weddingData.recentActivity.map(activity => (
                  <li key={activity.id} className="list-group-item border-0 py-3">
                    <div className="d-flex">
                      <div className="me-3">
                        {activity.type === 'task' && <i className="bi bi-check-circle text-success fs-5"></i>}
                        {activity.type === 'guest' && <i className="bi bi-people text-primary fs-5"></i>}
                        {activity.type === 'vendor' && <i className="bi bi-shop text-warning fs-5"></i>}
                      </div>
                      <div>
                        <p className="mb-0">{activity.message}</p>
                        <small className="text-muted">{new Date(activity.date).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 