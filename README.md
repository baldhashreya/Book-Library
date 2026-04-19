# Book Library Project - Handover Guide

This repository contains the full source code and automation suite for the **Book Library** application. This guide is designed to help you set up, run, and test the project with minimal technical effort.

## 🚀 Quick Start (Recommended)

The project includes automation scripts for both Windows and Linux/macOS. 

### 1. Setup
Install all dependencies (Node.js, Python, Playwright) and initialize environment variables.
- **Windows**: Double-click `setup.bat` or run in terminal.
- **Linux/macOS**: Run `./setup.sh` in terminal.

### 2. Run Application
Start the Backend and Frontend servers simultaneously.
- **Windows**: Double-click `run.bat` or run in terminal.
- **Linux/macOS**: Run `./run.sh` in terminal.
- **Access URL**: [http://localhost:5173](http://localhost:5173)

### 3. Run Tests & Reports
Execute all Backend (Pytest) and Frontend (Playwright) tests, then generate the Allure report.
- **Windows**: Double-click `test.bat` or run in terminal.
- **Linux/macOS**: Run `./test.sh` in terminal.

---

## 🛠️ Prerequisites
- **Node.js** (v18 or higher)
- **Python** (3.8 or higher)
- **MongoDB** (Running locally on default port 27017)
- **Allure CLI** (To view HTML reports)

---

## 📂 Project Architecture

- **`back_end/server`**: Node.js Express API.
- **`front_end`**: React.js application built with Vite.
- **`Test_cases/backend-test-cases`**: Python API tests using Pytest.
- **`Test_cases/front-end-test-cases`**: UI tests using Playwright.

---

## 🔧 Manual Configuration (Optional)
Configuration is handled via `.env` files created automatically from `.env.example` during setup:
- **Backend Port**: 5000 (Default)
- **Frontend Port**: 5173 (Default)

---

## 🆘 Troubleshooting
- **MongoDB Error**: Ensure MongoDB is running. The automation scripts will warn you if it's not detected on port 27017.
- **Command Not Found**: Ensure Node.js and Python are added to your system's PATH.
