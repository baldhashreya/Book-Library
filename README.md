# Libris - Enterprise-Grade Library Management Solution 📚

> A comprehensive, full-stack application designed to streamline and automate library operations, from inventory management to user role administration.

## 📖 Project Overview

Libris is a modern web application built to modernize library workflows. It empowers administrators and librarians to efficiently manage their catalog (books, authors, categories), track user activities, handle borrowing assignments, and control access permissions. 

**Real-world Use Case:** Perfect for educational institutions, public libraries, or corporate reading rooms that need a reliable, centralized system to manage their physical or digital book inventory and user memberships.

### Key Features
- **Comprehensive Catalog Management:** Full CRUD operations for books, authors, and categories.
- **Role-Based Access Control (RBAC):** Distinct roles (Admin, Librarian, User) to securely control access to specific features and data.
- **Book Assignments:** Seamlessly assign and track book borrowing by users.
- **Advanced Search & Filtering:** Quickly locate books, users, and authors using optimized search APIs.
- **Secure Authentication:** JWT-based login with token refresh and secure password handling.

---

## 🚀 Key Highlights & Engineering Strengths

This project was engineered with production-readiness in mind, demonstrating several core software development best practices:

- **Scalable Architecture:** Implemented a clean, layered backend architecture (Controllers → Services → Repositories → Models) ensuring high modularity and separation of concerns.
- **Clean Code Practices:** Strictly typed with **TypeScript** across the entire stack. Enforced code quality using standardized ESLint configurations.
- **Robust API Design:** Developed predictable, RESTful API endpoints utilizing structured request validation (`celebrate`/`joi`) and standardized error responses.
- **Security & Validation:** Client-side validation with Formik and Yup ensures clean data before it hits the robust backend validation layers.
- **Testing:** Integrated **Mocha & Chai** for comprehensive automated testing of API endpoints and core logic.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **UI Library:** Material UI (MUI) & Emotion
- **State & Routing:** React Router DOM
- **Form Handling:** Formik & Yup
- **HTTP Client:** Axios

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (RESTful APIs)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose)

### Tools / DevOps
- **Linting:** ESLint
- **Testing:** Mocha, Chai, Sinon, Playwright (E2E)
- **Process Management:** Nodemon, ts-node

---

## 🏗 Architecture Overview

The system follows a classic Client-Server architecture utilizing a REST API:
1. **Frontend (React/Vite):** A Single Page Application (SPA) that manages the user interface, client-side routing, and local state. It communicates with the backend via Axios, utilizing interceptors for automatic JWT token injection and centralized error handling (e.g., redirecting on unauthorized access).
2. **Backend (Node/Express):** A modularized server. Requests flow through Routers → Middleware (Auth/Validation) → Controllers (Request handling) → Services (Business logic) → Repositories (Database operations). This pattern ensures that business logic is completely decoupled from the HTTP layer.
3. **Database (MongoDB):** Stores all system data. Relationships between Books, Authors, and Categories are managed using MongoDB object references.

### Project Structure
```text
📦 Book Library
 ┣ 📂 back_end/server
 ┃ ┣ 📂 router/        # Express API route definitions
 ┃ ┣ 📂 src/
 ┃ ┃ ┣ 📂 controllers/ # HTTP request/response handlers
 ┃ ┃ ┣ 📂 services/    # Core business logic
 ┃ ┃ ┣ 📂 repositories/# Database interaction layer
 ┃ ┃ ┣ 📂 models/      # MongoDB Schema definitions
 ┃ ┃ ┣ 📂 middleware/  # Authentication & error handling
 ┃ ┃ ┗ 📂 utils/       # Shared utility functions
 ┣ 📂 front_end/src
 ┃ ┣ 📂 app/           # App-level routing and layout setup
 ┃ ┣ 📂 features/      # Domain-driven feature modules (Auth, Books, Users, etc.)
 ┃ ┣ 📂 services/      # Axios API configuration
 ┃ ┗ 📂 shared/        # Reusable UI components
 ┗ 📂 Test_cases/      # Automated test suites and data
```

---

## 🔌 API Documentation

APIs are logically grouped by their respective domains:

### Auth Module
- `POST /auth/login` - Authenticate user and return JWT
- `POST /auth/signup` - Register a new user
- `GET /auth/logout/:id` - Invalidate user session
- `PATCH /auth/refresh-token` - Issue a new access token
- `POST /auth/reset-password` - Reset account password

### Books Module
- `GET /books/:id` - Fetch book details
- `POST /books` - Add a new book
- `PUT /books/:id` - Update book information
- `DELETE /books/:id` - Remove a book
- `POST /books/search` - Query books based on filters
- `POST /books/:id/assign-book` - Assign book to a member

### Users & Roles Modules
- `POST /users/search` - Search through registered users
- `GET /users/:id` - Fetch user details
- `PATCH /users/:id/status` - Update user account status (active/inactive)
- `POST /roles` - Define a new system role
- `POST /roles/search` - Retrieve available roles

*(Additional standard CRUD APIs exist for `Categories`, `Authors`, and `Profile` modules following the same predictable REST conventions).*

---

## 🖥 Frontend Overview

The frontend is modularized into distinct, protected features:

1. **Login & Signup (`/login`, `/signup`)** - Entry points to the application.
2. **Dashboard Home (`/dashboard`)** - Aggregated statistics and quick actions.
3. **Books Management (`/books`)** - Data grid displaying the catalog, with modals for creation/editing.
4. **Categories Management (`/categories`)** - Manage organizational book tags.
5. **Author Management (`/author`)** - Maintain author profiles.
6. **User Administration (`/users`)** - Admin panel to manage accounts and statuses.
7. **Role Administration (`/role`)** - Define granular access levels.
8. **User Profile (`/about-me`)** - Personal account settings.

**Total Developed Screens: 9**

---

## 🛠 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or Atlas cluster)

### 1. Clone & Install
```bash
# Backend Setup
cd back_end/server
npm install

# Frontend Setup
cd ../../front_end
npm install
```

### 2. Environment Configuration
Create `.env` files in both backend and frontend directories based on the templates below.

### 3. Run the Application
```bash
# Open terminal 1: Start Backend (Runs on http://localhost:5000)
cd back_end/server
npm run start

# Open terminal 2: Start Frontend (Runs on http://localhost:5173)
cd front_end
npm run dev
```

---

## 🔐 Environment Variables

### Backend (`back_end/server/.env`)
```env
PORT=YOUR_PORT
ACCESS_TOKEN=YOUR_SECRET
REFRESH_TOKEN=YOUR_SECRET
MONGODB_URI=YOUR_DB_URL
DB_NAME=YOUR_DB_NAME
MONGODB_URL=YOUR_DB_URL
GROQ_API_KEY=YOUR_API_KEY
VALID_EMAIL=YOUR_TEST_EMAIL
VALID_PASSWORD=YOUR_TEST_PASSWORD
```

### Frontend (`front_end/.env`)
```env
VITE_API_BASE_URL=YOUR_API_URL
```

---

## 📜 Scripts Overview

**Backend (`back_end/server`)**
- `npm run start` - Starts the backend server using `nodemon` and `ts-node` for live reloading.
- `npm run test` - Executes the Mocha test suites.
- `npm run lint` - Lints the codebase using ESLint.

**Frontend (`front_end`)**
- `npm run dev` - Starts the Vite development server.
- `npm run build` - Compiles TypeScript and builds the production-ready application bundle.
- `npm run lint` - Lints the React codebase.

---

## 🚢 Deployment (High Level)
1. **Frontend:** Run `npm run build` to generate static assets. Deploy the `dist` folder to services like Vercel, Netlify, or AWS S3.
2. **Backend:** Ensure environment variables are set in your hosting platform (Render, Heroku, AWS EC2). Use a process manager like PM2 to serve the Node.js application.
3. **Database:** Host MongoDB on MongoDB Atlas and update the `MONGODB_URI` environment variable accordingly.

---

## 💡 Skills Demonstrated

Building this application required a broad spectrum of full-stack capabilities:

- **Backend Development:** Designed scalable REST APIs using Express.js. Structured the application using the Repository pattern to decouple database logic from business rules.
- **Frontend Development:** Architected a reactive UI using React and Material UI. Managed complex application state, implemented protected routing, and handled asynchronous data fetching cleanly.
- **Database Handling:** Designed efficient NoSQL schema structures using Mongoose, establishing reliable relations between entities without sacrificing query performance.
- **System Design Thinking:** Broke down the complex domain of library management into modular, independent domains (Auth, Users, Books), establishing a clean foundation capable of future expansion.
- **Debugging & Optimization:** Utilized global Axios interceptors for streamlined error handling, ensuring consistent application behavior even when network or authentication issues arise.
