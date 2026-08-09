# 🚀 Fullstack Secure Authentication App (Node.js & React)

A robust full-stack web application featuring secure user authentication using Node.js, Express, MongoDB, and React with JWT (JSON Web Tokens) integration.

---

## ✨ Features

- **User Registration & Login:** Secure signup and sign-in functionality with hashed passwords.
- **Cryptographic Security:** Passwords are securely hashed using `bcryptjs` before being stored in MongoDB.
- **JWT Authentication:** Secure token-based session management.
- **Protected Routes:** Backend middleware validation and frontend route protection ensuring only authenticated users can access the dashboard.
- **Item Management (CRUD):** Authenticated users can create, view, and delete their custom items securely with data ownership validation.
- **Optimistic UI:** Instant UI updates during item deletion for a seamless user experience.
- **Stripe Payment Gateway:** Integrated test mode checkout capability for secure simulated transactions.
- **Responsive UI:** Clean, modern frontend built with React and React Router.
- **Data Visualization Dashboard:** Integrated Chart.js analytics engine to display item metrics dynamically on the dashboard.
- **Server Hardening:** Protected REST API from brute-force attacks using `Helmet.js` and `express-rate-limit`.
- **Production Logging:** Implemented `Morgan` for structured and persistent server access logs.
- **Server-Side AI Middleware:** Secure backend integration with Google Gemini AI to prevent API key exposure on the client side.
- **Automated Data Enrichment:** Automatically summarizes, tags, and categorizes data payloads via LLM before saving them to MongoDB.

---

## 💻 Tech Stack

- **Frontend:** React, React Router, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Payments:** Stripe API (Test Mode)
- **Visualization:** Chart.js, react-chartjs-2
- **Security:** bcryptjs, JSON Web Tokens (JWT), CORS
- **Security & Logging:** Helmet.js, express-rate-limit, Morgan
- **AI Integration:** Google Gemini API (Server-Side Proxy)

---

## Project Structure

```text
project-root/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Register, Login, Dashboard
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── middleware/             # Express Middleware
│   └── auth.js             # JWT Verification Middleware
│
├── models/                 # Mongoose Models
│   └── User.js
│
├── .env                    # Environment Variables
├── server.js               # Express Server Entry Point
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas account or local MongoDB instance

### 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vandanamahant/prodesk-auth-.git
   ```

2. **Backend Setup:**
   - Navigate to the root directory and install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the root directory and add your configurations:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     ```
   - Start the backend server:
     ```bash
     node server.js
     ```

3. **Frontend Setup:**
   - Navigate to the client directory:
     ```bash
     cd client
     ```
   - Install client dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm run dev
     ```

---

## 👨‍💻 Author: 
**Vandana Mahant**