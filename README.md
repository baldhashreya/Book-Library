# Book Library

A full-stack web application designed for managing a book library. This project is set up as a monorepo containing a frontend application, a backend server, and a comprehensive suite of automated tests.

## Project Structure

The repository is organized into the following main workspaces:

- **`front_end/`**: Contains the frontend application code.
- **`back_end/`**: Contains the backend services, structured as:
  - `server/`: The main backend logic and API services.
  - `common/`: Shared code and utilities used across the backend.
- **`Test_cases/`**: Contains a robust, data-driven automation suite. It includes both backend API validation tests (using pytest/requests) and frontend end-to-end tests (using Playwright).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for frontend and backend services)
- [Python](https://www.python.org/) (for running Python-based automated tests)

### Installation

This project uses npm workspaces to manage dependencies across the different directories.

1. Clone the repository and navigate to the project root directory:
   ```bash
   cd "Book Library"
   ```

2. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

## Testing

The project includes an extensive suite of automated tests focusing on API endpoint validation (e.g., login, signup, reset password) and UI interaction workflows. Test data is managed via CSV files (Data-Driven Testing approach).

Navigate to the `Test_cases/` directory or respective test folders to execute the test suites according to their specific configurations.
