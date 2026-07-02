# Quickcart Customer Portal

Welcome to Phase 1 of the Quickcart e-commerce suite. This is a fully production-ready, highly interactive Customer Portal built using a unified MERN stack (React, Node/Express, MongoDB). It closely implements the design layouts, color systems, spacing, and nutritional tables from the provided reference designs.

## Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router (v6), Context API, Lucide Icons
- **Backend**: Node.js, Express, JSON Web Tokens (JWT), BcryptJS
- **Database**: MongoDB (Mongoose schemas for Users, Products, Carts, Wishlists, and Orders)

---

## Folder Structure

- `/src` - React frontend codebase (pages, reusable components, context providers, API wrappers).
- `/models` - MongoDB schema definitions.
- `/routes` - Router mappings for all REST api routes.
- `/controllers` - Logic handlers for authentication, products, cart, wishlist, and orders.
- `/middleware` - Express authentication and role checking logic.
- `/config` - Database connection and mock seed data scripting.

---

## Installation & Setup

Follow these steps to run the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas) running on your machine

### 1. Clone & Install Dependencies
Run the following in the project root:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (one has been created for you with defaults):
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quickcart
JWT_SECRET=quickcartsecret12345
NODE_ENV=development
```

### 3. Seed Database
Seeding wipes any previous products and populates the database with realistic food items matching the exact items in the reference images (Organic Avocados, Strawberries, Eggs, Cheddar, Bell Peppers, etc.), including nutritional figures.
```bash
npm run seed
```

### 4. Run the Application
To run the server and the React application concurrently (Vite on port 3000, Express on port 5000 with hot-reload):
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Features Handled (Phase 1)

1. **Sticky Header Navbar**: Responsive search, reactive cart count badge, wishlist indicator, and user account actions.
2. **Interactive Catalog Filter**: Sidebar departments selector (`Fruits & Veggies`, `Bakery`, `Dairy & Eggs`, etc.) synced with URL parameters and real-time database queries.
3. **Cart & Quantity System**: Complete addition, decrement, increment, and deletion updates synchronized with the database in real-time. Supports coupon **"FRESH20"** to deduct 20% from order subtotals.
4. **Wishlist Sync**: Save items to a personalized wishlist, perform quick additions to cart, and toggle saves directly from product cards.
5. **Secure Checkout Form**: Shipping address configuration, overnight delivery calculations, custom cardholder inputs, and form format validations.
6. **Order confirmation & retrieval**: View order success indicators, totals, dates, expected deliveries, and collapsible summaries on user profiles.