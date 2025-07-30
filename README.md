# BookManager Application

BookManager is a full-stack application designed to manage a collection of books. It features user authentication, book listing, and book management functionalities.

## Features

- User Registration and Authentication (Login/Logout)
- JWT-based authentication with refresh tokens
- Add new books (protected route)
- View a list of books with search and pagination
- Client-side form validation
- Responsive UI with Material-UI components

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT (JSON Web Tokens) for authentication
- bcryptjs for password hashing
- morgan for logging
- cors for Cross-Origin Resource Sharing

### Frontend

- React.js
- Vite (build tool)
- Redux Toolkit for state management
- React Router DOM for routing
- Material-UI for UI components
- Axios for API requests

## Setup Instructions

Follow these steps to set up and run the BookManager application locally.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (Node Package Manager)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd BookManager
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

#### Installation

Install backend dependencies:

```bash
npm install
```

#### Environment Variables

Create a `.env` file in the `backend` directory with the following content:

```
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
FRONTEND_URL=http://localhost:5173
PORT=3000
```

- `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
- `JWT_ACCESS_SECRET`: A strong, random secret key for JWT access tokens.
- `JWT_REFRESH_SECRET`: A strong, random secret key for JWT refresh tokens.
- `FRONTEND_URL`: The URL where your frontend application will be running (e.g., `http://localhost:5173`).
- `PORT`: The port for the backend server (default is `3000`).

#### Running the Backend

To start the backend server in development mode (with `nodemon`):

```bash
npm run dev
```

The backend server will run on `http://localhost:3000` (or your specified PORT).

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

#### Installation

Install frontend dependencies:

```bash
npm install
```

#### Environment Variables

Create a `.env` file in the `frontend` directory with the following content:

```
VITE_API_URL=http://localhost:3000/api
```

- `VITE_API_URL`: The base URL of your backend API (e.g., `http://localhost:3000/api`).

#### Running the Frontend

To start the frontend development server:

```bash
npm run dev
```

The frontend application will typically run on `http://localhost:5173`.

## Deployment

This application is deployed on platforms like Vercel (for frontend) and Railway (for backend).
