import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Services
import AuthService from './services/auth.service';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import VenueList from './pages/VenueList';
import VenueDetails from './pages/VenueDetails';
import ManageVenues from './pages/ManageVenues';
import WeddingDetails from './pages/WeddingDetails';
import GuestList from './pages/GuestList';
import TaskList from './pages/TaskList';
import VendorList from './pages/VendorList';
import Budget from './pages/Budget';
import NotFound from './pages/NotFound';

// Private route component
const PrivateRoute = ({ children }) => {
  const isLoggedIn = AuthService.isUserLoggedIn();
  
  return isLoggedIn ? children : <Navigate to="/login" />;
};

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setIsLoading(false);
  }, []);

  // Protected route wrapper
  const ProtectedRoute = ({ children, roles }) => {
    if (isLoading) {
      return <div className="text-center mt-5">Loading...</div>;
    }
    
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    // Check if user has required role
    if (roles && !roles.some(role => currentUser.roles.includes(role))) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header currentUser={currentUser} />
      <main className="flex-grow-1 container py-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={["ROLE_USER", "ROLE_COUPLE", "ROLE_VENDOR", "ROLE_ADMIN"]}>
              <Navigate to="/weddings/123/dashboard" replace />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/dashboard" element={
            <ProtectedRoute roles={["ROLE_USER", "ROLE_COUPLE", "ROLE_VENDOR", "ROLE_ADMIN"]}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Venue routes */}
          <Route path="/venues" element={<VenueList />} />
          <Route path="/venues/:id" element={<VenueDetails />} />
          <Route path="/venues/browse" element={<VenueList />} />
          <Route path="/manage-venues" element={
            <ProtectedRoute roles={["ROLE_VENDOR", "ROLE_ADMIN"]}>
              <ManageVenues />
            </ProtectedRoute>
          } />
          
          {/* Wedding management routes */}
          <Route path="/weddings/:id" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <WeddingDetails />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/edit" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <WeddingDetails />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/checklist" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <TaskList />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/guests" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <GuestList />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/tasks" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <TaskList />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/tasks/new" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <TaskList />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/vendors" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <VendorList />
            </ProtectedRoute>
          } />
          <Route path="/weddings/:id/budget" element={
            <ProtectedRoute roles={["ROLE_COUPLE", "ROLE_ADMIN"]}>
              <Budget />
            </ProtectedRoute>
          } />

          {/* Catch-all route for 404s */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App; 