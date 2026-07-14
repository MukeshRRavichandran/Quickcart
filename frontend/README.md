# Quantum Quick Cart - Frontend

This is the frontend application for Quantum Quick Cart, built with modern web technologies to provide a high-performance, interactive, and beautiful user experience for customers, sellers, and administrators.

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM (v6)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: Lucide React

## Folder Structure

- `/src` - The core application codebase.
  - `/components` - Reusable UI components (Navbar, Footer, Modals).
  - `/context` - Global state management (Auth, Cart, Wishlist, Admin, Seller).
  - `/pages` - Page-level components corresponding to different routes (Home, Shop, Cart, Profile).
  - `/services` - API integration services to interact with the backend.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm run client`

Runs the app in the development mode using Vite.
Open [http://localhost:5184](http://localhost:5184) to view it in the browser.
The page will reload if you make edits.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`

Locally preview the production build.

## Workflow & Architecture

The frontend follows a component-driven architecture using Context API for state management.
It communicates with the backend via RESTful APIs implemented in the `/services` folder. Authentication is handled using JWT tokens, which are stored securely and attached to subsequent requests.
