# Quantum Quick Cart - Backend

This is the RESTful API backend for Quantum Quick Cart, designed to securely handle data operations for users, products, orders, and authentication across all portals (Customer, Admin, and Seller).

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS for password hashing
- **Middleware**: CORS, Morgan (logging), Multer (file uploads)

## Folder Structure

- `/models` - Mongoose schemas representing database collections (User, Product, Order, etc.).
- `/controllers` - Core business logic handling requests and returning responses.
- `/routes` - API route definitions mapping HTTP endpoints to controllers.
- `/middleware` - Custom middleware for authentication, authorization (role-based access), and error handling.
- `/config` - Database connection setup and seed scripts.

## Available Scripts

In the project directory, you can run:

### `npm run server`

Runs the Express server in development mode using Nodemon.
By default, the server runs on [http://localhost:5183](http://localhost:5183).
Nodemon will automatically restart the server upon any file changes.

### `npm run seed`

Seeds the MongoDB database with initial sample data (Admin, Seller, Customer users, and products).
**Warning**: This may clear existing database collections before seeding.

## Workflow & Architecture

The backend follows an MVC-like structure (without views). 
1. **Routing**: Incoming HTTP requests hit the Express router (`/routes`).
2. **Middleware**: Requests pass through authentication (`auth.js`) to verify JWT tokens and user roles.
3. **Controllers**: The router forwards requests to the appropriate controller (`/controllers`), which executes business logic.
4. **Database Models**: Controllers interact with MongoDB via Mongoose schemas (`/models`) to perform CRUD operations.
5. **Response**: A JSON response is sent back to the frontend.

## Environment Variables

Ensure you have a `.env` file in the root of the project with the necessary configurations:
- `PORT` (Default: 5183)
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV`
