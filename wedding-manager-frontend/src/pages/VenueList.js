import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const VenueList = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    capacity: '',
    priceRange: '',
    amenities: []
  });

  useEffect(() => {
    // In a real app, you would fetch venues from an API
    // For now, we'll use mock data
    const mockVenues = [
      {
        id: 1,
        name: 'Crystal Garden Resort',
        location: 'New York, NY',
        description: 'A luxurious venue with beautiful garden views and elegant ballrooms.',
        capacity: 300,
        priceRange: '$$$',
        rating: 4.8,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Crystal+Garden',
        amenities: ['Indoor ceremony', 'Outdoor ceremony', 'Catering', 'Parking', 'Accommodation']
      },
      {
        id: 2,
        name: 'Lakeview Manor',
        location: 'Chicago, IL',
        description: 'Stunning lake views with spacious reception halls perfect for large gatherings.',
        capacity: 250,
        priceRange: '$$',
        rating: 4.5,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Lakeview+Manor',
        amenities: ['Indoor ceremony', 'Lakeside ceremony', 'In-house catering', 'Parking']
      },
      {
        id: 3,
        name: 'Sunset Beach Resort',
        location: 'Miami, FL',
        description: 'Beautiful beachfront venue with breathtaking sunset views.',
        capacity: 200,
        priceRange: '$$$$',
        rating: 4.9,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Sunset+Beach+Resort',
        amenities: ['Beach ceremony', 'Indoor reception', 'Catering', 'Accommodation', 'Spa']
      },
      {
        id: 4,
        name: 'Rustic Barn Weddings',
        location: 'Austin, TX',
        description: 'Charming rustic barn with modern amenities in a country setting.',
        capacity: 150,
        priceRange: '$$',
        rating: 4.6,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Rustic+Barn',
        amenities: ['Barn ceremony', 'Outdoor reception', 'DIY catering allowed', 'Parking']
      },
      {
        id: 5,
        name: 'Grand Ballroom Hotel',
        location: 'Los Angeles, CA',
        description: 'Elegant ballroom with luxury accommodations in downtown.',
        capacity: 400,
        priceRange: '$$$',
        rating: 4.7,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Grand+Ballroom',
        amenities: ['Indoor ceremony', 'Premium catering', 'Valet parking', 'Accommodation']
      },
      {
        id: 6,
        name: 'Mountain View Lodge',
        location: 'Denver, CO',
        description: 'Scenic mountain views with indoor and outdoor ceremony options.',
        capacity: 180,
        priceRange: '$$$',
        rating: 4.4,
        imageUrl: 'https://placehold.co/600x400/e9ecef/495057?text=Mountain+View',
        amenities: ['Mountain ceremony', 'Indoor reception', 'Catering', 'Accommodation']
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setVenues(mockVenues);
      setLoading(false);
    }, 800);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFilters(prevFilters => {
      if (prevFilters.amenities.includes(amenity)) {
        return {
          ...prevFilters,
          amenities: prevFilters.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prevFilters,
          amenities: [...prevFilters.amenities, amenity]
        };
      }
    });
  };

  // Apply filters
  const filteredVenues = venues.filter(venue => {
    return (
      (filters.location === '' || venue.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (filters.capacity === '' || venue.capacity >= parseInt(filters.capacity || 0)) &&
      (filters.priceRange === '' || venue.priceRange === filters.priceRange) &&
      (filters.amenities.length === 0 || filters.amenities.every(amenity => venue.amenities.includes(amenity)))
    );
  });

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading venues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h1 className="mb-4">Wedding Venues</h1>
      
      <div className="row">
        {/* Filters sidebar */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Filters</h5>
              
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  placeholder="City, State"
                  value={filters.location}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="capacity" className="form-label">Minimum Capacity</label>
                <select
                  className="form-select"
                  id="capacity"
                  name="capacity"
                  value={filters.capacity}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="50">50+ guests</option>
                  <option value="100">100+ guests</option>
                  <option value="200">200+ guests</option>
                  <option value="300">300+ guests</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="priceRange" className="form-label">Price Range</label>
                <select
                  className="form-select"
                  id="priceRange"
                  name="priceRange"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="">Any</option>
                  <option value="$">$ (Budget)</option>
                  <option value="$$">$$ (Moderate)</option>
                  <option value="$$$">$$$ (Premium)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Amenities</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="indoor"
                    checked={filters.amenities.includes('Indoor ceremony')}
                    onChange={() => handleAmenityChange('Indoor ceremony')}
                  />
                  <label className="form-check-label" htmlFor="indoor">
                    Indoor ceremony
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="outdoor"
                    checked={filters.amenities.includes('Outdoor ceremony')}
                    onChange={() => handleAmenityChange('Outdoor ceremony')}
                  />
                  <label className="form-check-label" htmlFor="outdoor">
                    Outdoor ceremony
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="catering"
                    checked={filters.amenities.includes('Catering')}
                    onChange={() => handleAmenityChange('Catering')}
                  />
                  <label className="form-check-label" htmlFor="catering">
                    Catering
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="accommodation"
                    checked={filters.amenities.includes('Accommodation')}
                    onChange={() => handleAmenityChange('Accommodation')}
                  />
                  <label className="form-check-label" htmlFor="accommodation">
                    Accommodation
                  </label>
                </div>
              </div>
              
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => setFilters({
                  location: '',
                  capacity: '',
                  priceRange: '',
                  amenities: []
                })}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
        
        {/* Venues list */}
        <div className="col-lg-9">
          {filteredVenues.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No venues match your current filters. Try adjusting your criteria.
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 g-4">
              {filteredVenues.map(venue => (
                <div key={venue.id} className="col">
                  <div className="card h-100 border-0 shadow-sm">
                    <img
                      src={venue.imageUrl}
                      className="card-img-top"
                      alt={venue.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title">{venue.name}</h5>
                        <span className="badge bg-primary rounded-pill">{venue.priceRange}</span>
                      </div>
                      <p className="card-text text-muted mb-2">
                        <i className="bi bi-geo-alt-fill me-1"></i> {venue.location}
                      </p>
                      <p className="card-text mb-2">
                        <span className="badge bg-success me-1">
                          <i className="bi bi-star-fill me-1"></i>
                          {venue.rating}
                        </span>
                        <span className="text-muted ms-2">
                          <i className="bi bi-people-fill me-1"></i> Up to {venue.capacity} guests
                        </span>
                      </p>
                      <p className="card-text">{venue.description}</p>
                      <div className="mb-3">
                        {venue.amenities.slice(0, 3).map((amenity, index) => (
                          <span key={index} className="badge bg-light text-dark me-1 mb-1">{amenity}</span>
                        ))}
                        {venue.amenities.length > 3 && (
                          <span className="badge bg-light text-dark me-1 mb-1">+{venue.amenities.length - 3} more</span>
                        )}
                      </div>
                      <Link to={`/venues/${venue.id}`} className="btn btn-outline-primary">View Details</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenueList; 