# Krishak - MERN Stack Project

This repository contains the source code for **Krishak**, a full-stack web application built using the MERN stack (MongoDB, Express.js, React, Node.js) and styled with Tailwind CSS.

## 🚀 Tech Stack

### Frontend (`/client`)
- **Framework**: [React](https://react.dev/) (via [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)

### Backend (`/server`)
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (via [Mongoose](https://mongoosejs.com/))
- **Security**: [Helmet](https://helmetjs.github.io/), [CORS](https://www.npmjs.com/package/cors)
- **Logging**: [Morgan](https://www.npmjs.com/package/morgan)
- **Environment**: [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 📂 Project Structure

The project follows a modular structure to ensure scalability and ease of collaboration.

```
Krishak/
├── client/                 # Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Tailwind directives
│   ├── public/             # Static assets
│   └── ...config files
│
├── server/                 # Backend Application
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Request handlers (Business logic)
│   │   ├── middlewares/    # Custom middlewares (Error handling, Auth)
│   │   ├── models/         # Mongoose Data Models
│   │   ├── routes/         # API Routes definitions
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   └── .env.example        # Example environment variables
│
└── README.md               # Project Documentation
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Krishak/SRC_CODE
    ```

2.  **Backend Setup**
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in the `server` directory based on `.env.example`.
    - Update `MONGO_URI` if you are using a different database connection.

3.  **Frontend Setup**
    ```bash
    cd ../client
    npm install
    ```

---

## 🏃‍♂️ Running the Project

### Start the Backend Server
In the `server` directory:
```bash
npm run dev
```
*Runs on `http://localhost:5000` by default.*

### Start the Frontend Client
In the `client` directory:
```bash
npm run dev
```
*Runs on `http://localhost:5173` by default.*

---

## 🛡️ Best Practices Implemented

- **Modularity**: Separation of concerns (Routes, Controllers, Models).
- **Security**: Basic security headers with Helmet and CORS configuration.
- **Error Handling**: Centralized error handling middleware in the backend.
- **Clean Code**: ESLint configured for the frontend.
- **Modern Tooling**: Vite for fast frontend development.

## 🤝 Contribution

1.  Checkout to the `main` branch.
2.  Pull the latest changes.
3.  Create a new feature branch.
4.  Commit your changes and push.
