# Quickcart E-Commerce Platform

Welcome to the Quickcart e-commerce suite! This project is a fully functional, highly interactive MERN stack (MongoDB, Express.js, React, Node.js) platform. It includes three main applications:
1. **Frontend (Customer Portal)**: For customers to browse products, add to cart, and checkout.
2. **Admin Dashboard**: For sellers and administrators to manage products, view analytics, and handle orders.
3. **Backend API**: A unified Express/Node.js server that powers both the frontend and admin applications.

## Technology Stack

- **Frontend & Admin**: React (Vite), Tailwind CSS, React Router (v6), Context API, Lucide Icons
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), BcryptJS, Multer (for file uploads)
- **Database**: MongoDB (Mongoose schemas for Users, Products, Carts, Wishlists, and Orders)

---

## Folder Structure

- `/frontend` - React application for the customer-facing e-commerce portal.
- `/admin` - React application for the seller/admin dashboard.
- `/backend` - Node/Express server and API.
  - `/backend/models` - MongoDB schema definitions.
  - `/backend/routes` - Router mappings for all REST api routes.
  - `/backend/controllers` - Logic handlers for authentication, products, cart, wishlist, and orders.
  - `/backend/middleware` - Express authentication and role checking logic.
  - `/backend/config` - Database connection configuration.

---

## Installation & Setup

Follow these steps to run the complete project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas) running on your machine

### 1. Install Dependencies
You need to install dependencies for all three parts of the application. Open your terminal and run:

```bash
# Install root/concurrently dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install admin dependencies
cd admin
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables
You need a `.env` file in the `/backend` directory.

Create `backend/.env` (if not already present):
```env
PORT=4555
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 3. Run the Application
You can run all three applications concurrently from the root directory using the setup scripts.

Run the following in the project root:
```bash
npm run dev
```

This will concurrently start:
- **Backend Server** on `http://localhost:4555`
- **Frontend App** on `http://localhost:5193`
- **Admin App** on `http://localhost:5195`

### 4. Access the Applications
- **Customer Portal:** Open [http://localhost:5193](http://localhost:5193) in your browser.
- **Admin/Seller Dashboard:** Open [http://localhost:5195](http://localhost:5195) in your browser.
- **Backend API Base:** `http://localhost:4555/api`

---

## Development Workflow

### Frontend Workflow
1. Customers visit the frontend (Port 5193) to browse products.
2. The frontend makes API calls to the backend (`/api/products`, `/api/cart`, etc.) on Port 4555.
3. State is managed globally via React Context API, allowing real-time updates to the cart and wishlist badges.

### Admin Workflow
1. Sellers visit the admin dashboard (Port 5195) to manage their store.
2. They log in, and a JWT token is stored securely.
3. The dashboard makes authorized API calls to the backend (`/api/admin/*`, `/api/upload`, etc.) on Port 4555 to add new products, check revenue, and update orders.

### Backend Workflow
1. The Express server acts as the single source of truth connecting to MongoDB.
2. Authentication is handled using JWT tokens, passed as Bearer tokens in headers.
3. Protected routes use middleware to verify the token and the user's role (e.g., verifying if the user is an 'admin' or 'seller').

---

## Core Features 

### Customer Portal
- **Sticky Header Navbar**: Responsive search, reactive cart count badge, wishlist indicator, and user account actions.
- **Interactive Catalog Filter**: Sidebar departments selector synced with URL parameters and real-time database queries.
- **Cart & Checkout**: Complete quantity system, synchronized with the database in real-time. Secure checkout form.
- **Wishlist Sync**: Save items to a personalized wishlist.

### Admin Dashboard
- **Analytics & Revenue**: Visual charts showing sales and revenue trends.
- **Product Management**: Create, edit, delete products with image uploading support (via Multer).
- **Order Tracking**: View recent customer orders, update shipping statuses, and track fulfillment.