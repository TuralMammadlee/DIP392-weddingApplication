# Applied System Software - Wedding Manager Project

## Overview

👥 Team Members

    Tural Mammadli
    Tural Asgarov
    Rza Mirzayev

📌 What’s This App About?

Weddings involve a lot of moving parts—guest lists, RSVPs, budgets, and more. Our goal is to create an easy-to-use platform that helps couples keep everything in one place, reducing stress and making the planning process smooth and enjoyable.

📄 Project Report
📑 https://docs.google.com/document/d/1UvPmUDsrvLCEIT5NieUSTxgQaRbkNYvM/edit?usp=sharing&ouid=103696701979092113311&rtpof=true&sd=true

This project is a Wedding Manager application designed to streamline the wedding planning process. It features a React frontend (`wedding-manager-frontend`) and a Spring Boot backend (`wedding-manager`) using a PostgreSQL database.

The system aims to minimize manual errors, simplify event preparation, and enhance the experience for couples, vendors, and administrators.

## Project Structure

*   `wedding-manager/`: Contains the Spring Boot backend application (Java).
    *   Handles business logic, API endpoints, security (JWT), and database interactions (JPA with PostgreSQL).
*   `wedding-manager-frontend/`: Contains the React frontend application (JavaScript/JSX).
    *   Provides the user interface and interacts with the backend via RESTful APIs.
*   `README.md`: (This file) General overview of the project.

## Core Features (Intended)

*   **User Roles & Accounts:** Secure registration and login for Couples, Vendors, and Admins.
*   **Dashboard:** Overview of guests, expenses, and pending tasks for logged-in users.
*   **Guest Management:** Add, track RSVPs, and manage guest lists.
*   **Venue Booking:** Browse, view details, and book venues.
*   **Vendor Tracking:** Find, manage, and track service vendors.
*   **Budget Management:** Set budgets and track expenses.
*   **Task Scheduler:** Create tasks, set deadlines, and receive reminders.

## Getting Started (Development)

### Backend (`wedding-manager` - Spring Boot)

1.  **Prerequisites:**
    *   Java JDK (version 17 or as specified in `pom.xml`).
    *   Apache Maven.
    *   PostgreSQL server running and accessible.
2.  **Configuration:**
    *   Ensure `wedding-manager/src/main/resources/application.properties` is configured with your PostgreSQL connection details (URL, username, password).
    *   Create the specified database in PostgreSQL (e.g., `wedding_application_db`).
3.  **Running the Backend:**
    *   Navigate to the `wedding-manager` directory.
    *   Run the application using Maven: `mvn spring-boot:run`
    *   Alternatively, import as a Maven project into your IDE (IntelliJ, Eclipse, VS Code) and run the main application class.
    *   The backend will typically start on `http://localhost:8080`.

### Frontend (`wedding-manager-frontend` - React)

1.  **Prerequisites:**
    *   Node.js and npm (or yarn).
2.  **Installation:**
    *   Navigate to the `wedding-manager-frontend` directory.
    *   Install dependencies: `npm install` (or `yarn install`).
3.  **Running the Frontend:**
    *   In the `wedding-manager-frontend` directory, run: `npm start` (or `yarn start`).
    *   The frontend development server will typically start on `http://localhost:3000` and will proxy API requests to the backend (usually configured in `package.json` or setupProxy.js).

## User Interaction (High-Level)

*   Users will access the application via a web browser (frontend).
*   They will register and log in based on their role (Couple, Vendor, Admin).
*   Based on their role, they will access features like the dashboard, guest list management, venue booking, etc., through the user interface.
*   The frontend communicates with the backend APIs to fetch and save data.
