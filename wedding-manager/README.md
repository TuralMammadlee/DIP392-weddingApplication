# Wedding Management System

A comprehensive wedding management application built with Spring Boot, PostgreSQL, and a modern frontend.

## Features

- **User Management**: Register and authenticate users with different roles (Couple, Vendor, Admin)
- **Venue Management**: Browse, search, and book wedding venues
- **Guest Management**: Manage guest lists, track RSVPs, and manage dietary requirements
- **Task Management**: Create, assign, and track wedding tasks with notifications
- **Vendor Management**: Manage vendors, contracts, and payment status
- **Budget Management**: Track wedding expenses and stay within budget

## Technologies

### Backend
- Java 17
- Spring Boot 3.2.1
- Spring Security with JWT authentication
- Spring Data JPA
- PostgreSQL

### Frontend
- React
- Bootstrap / Material-UI
- Axios for API communication
- React Router for navigation

## Getting Started

### Prerequisites
- Java 17 or higher
- PostgreSQL 12 or higher
- Node.js and npm (for the frontend)

### Database Setup
1. Create a PostgreSQL database named `wedding_manager`
2. Configure the database connection in `src/main/resources/application.properties`

### Running the Backend
```bash
cd wedding-manager
./mvnw spring-boot:run
```

### Running the Frontend
```bash
cd wedding-manager-frontend
npm install
npm start
```

## API Documentation

### Authentication
- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Authenticate a user and receive a JWT token

### Venues
- `GET /api/venues/public/available`: Get all available venues
- `GET /api/venues/public/search/city/{city}`: Search venues by city
- `GET /api/venues/public/search/state/{state}`: Search venues by state
- `GET /api/venues/public/search/capacity/{capacity}`: Search venues by capacity
- `GET /api/venues/public/{id}`: Get venue details by ID
- `GET /api/venues/owner`: Get venues owned by the current vendor
- `POST /api/venues`: Create a new venue (for vendors)
- `PUT /api/venues/{id}`: Update a venue (for venue owners)
- `DELETE /api/venues/{id}`: Delete a venue (for venue owners)

### Weddings
- `GET /api/weddings`: Get all weddings for the current couple
- `GET /api/weddings/{id}`: Get wedding details by ID
- `POST /api/weddings`: Create a new wedding
- `PUT /api/weddings/{id}`: Update a wedding
- `PUT /api/weddings/{id}/addCouple`: Add a partner to the wedding
- `DELETE /api/weddings/{id}`: Delete a wedding

### Guests
- `GET /api/guests/wedding/{weddingId}`: Get all guests for a wedding
- `GET /api/guests/wedding/{weddingId}/status/{status}`: Get guests by invitation status
- `GET /api/guests/{id}`: Get guest details by ID
- `POST /api/guests/wedding/{weddingId}`: Add a new guest to a wedding
- `PUT /api/guests/{id}`: Update a guest
- `PUT /api/guests/{id}/status/{status}`: Update a guest's invitation status
- `DELETE /api/guests/{id}`: Delete a guest
- `GET /api/guests/count/wedding/{weddingId}`: Get the total guest count for a wedding
- `GET /api/guests/count/wedding/{weddingId}/status/{status}`: Get the guest count by status

### Tasks
- `GET /api/tasks/wedding/{weddingId}`: Get all tasks for a wedding
- `GET /api/tasks/wedding/{weddingId}/status/{status}`: Get tasks by status
- `GET /api/tasks/wedding/{weddingId}/overdue`: Get overdue tasks
- `GET /api/tasks/assigned`: Get tasks assigned to the current user
- `GET /api/tasks/{id}`: Get task details by ID
- `POST /api/tasks/wedding/{weddingId}`: Create a new task
- `PUT /api/tasks/{id}`: Update a task
- `PUT /api/tasks/{id}/status/{status}`: Update a task's status
- `DELETE /api/tasks/{id}`: Delete a task

### Vendors
- `GET /api/vendors/wedding/{weddingId}`: Get all vendors for a wedding
- `GET /api/vendors/wedding/{weddingId}/type/{type}`: Get vendors by type
- `GET /api/vendors/wedding/{weddingId}/payment/deposit/{isPaid}`: Get vendors by deposit payment status
- `GET /api/vendors/wedding/{weddingId}/payment/full/{isPaid}`: Get vendors by full payment status
- `GET /api/vendors/{id}`: Get vendor details by ID
- `POST /api/vendors/wedding/{weddingId}`: Add a new vendor to a wedding
- `PUT /api/vendors/{id}`: Update a vendor
- `PUT /api/vendors/{id}/payment/deposit/{isPaid}`: Update a vendor's deposit payment status
- `PUT /api/vendors/{id}/payment/full/{isPaid}`: Update a vendor's full payment status
- `DELETE /api/vendors/{id}`: Delete a vendor

## Security

The application uses JSON Web Tokens (JWT) for authentication. Protected endpoints require a valid JWT token in the Authorization header.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 