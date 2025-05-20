# Wedding Manager Frontend

This is the frontend application for the Wedding Management System, built with React.

## Features

- User authentication and authorization
- Dashboard for couples to manage their wedding
- Venue browsing and booking
- Guest list management
- Task tracking
- Vendor management
- Budget tracking

## Technologies Used

- React 18
- React Router for navigation
- Formik and Yup for form validation
- Axios for API requests
- Bootstrap 5 for styling
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page components
├── services/         # API services
├── assets/           # Static assets
└── utils/            # Utility functions
```

## Available Scripts

In the project directory, you can run:

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Connecting to the Backend

The frontend connects to a Java Spring Boot backend. Make sure the backend server is running on `http://localhost:8080`.

## Learn More

For more information about React, check out the [React documentation](https://reactjs.org/).

## License

This project is licensed under the MIT License. 