# PERN Stack E-commerce Application

This project is a full-stack e-commerce application built using the PERN (PostgreSQL, Express, React, Node.js) stack. It provides a comprehensive online shopping experience with user authentication, product management, cart functionality, and order processing.

## Repository Structure

The repository is organized into two main parts: the backend (root directory) and the frontend (in the `frontend` directory).

### Backend Structure:
- `config/`: Contains database configuration (`db.js`)
- `middleware/`: Custom middleware, including authentication (`auth.js`)
- `routes/`: API route handlers
  - `auth.js`: Authentication routes
  - `cart.js`: Shopping cart operations
  - `categories.js`: Product category management
  - `orders.js`: Order processing and management
  - `products.js`: Product CRUD operations
  - `users.js`: User management
- `server.js`: Main Express application file

### Frontend Structure:
- `public/`: Static assets and HTML template
- `src/`: React application source code
  - `components/`: Reusable React components
  - `context/`: React context providers
  - `pages/`: React components for different pages
  - `services/`: API service functions
  - `styles/`: CSS stylesheets
  - `App.js`: Main React component
  - `index.js`: Entry point of the React application

## Usage Instructions

### Prerequisites
- Node.js (v14 or later)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
   JWT_SECRET=<your-secret-key>
   ```

5. Set up the database:
   Run the SQL commands in `database.sql` to create the necessary tables.

### Running the Application

1. Start the backend server:
   ```
   npm run server
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

3. Access the application at `http://localhost:3000`

## Data Flow

The application follows a typical client-server architecture:

1. The React frontend sends HTTP requests to the Express backend API.
2. The Express server processes these requests, interacting with the PostgreSQL database as needed.
3. The server sends back JSON responses, which the frontend then renders.

```
[Browser] <-> [React Frontend] <-> [Express Backend] <-> [PostgreSQL Database]
```

Key data flows include:
- User authentication (login/register)
- Product browsing and searching
- Cart management
- Order placement and processing

## Deployment

For deployment, consider the following steps:

1. Set up a production PostgreSQL database.
2. Configure environment variables for production.
3. Build the React frontend: `cd frontend && npm run build`
4. Serve the static files from the Express backend.
5. Use a process manager like PM2 to run the Node.js application.
6. Set up a reverse proxy (e.g., Nginx) to handle HTTPS and serve the application.

## Troubleshooting

Common issues and solutions:

1. Database connection errors:
   - Ensure PostgreSQL is running and accessible.
   - Check the `DATABASE_URL` in your `.env` file.

2. Authentication issues:
   - Verify the `JWT_SECRET` in your `.env` file.
   - Check if the token is being properly set and sent in requests.

3. CORS errors:
   - Ensure the frontend URL is properly set in the CORS configuration in `server.js`.

For debugging:
- Check server logs for backend issues.
- Use browser developer tools for frontend debugging.
- Enable more verbose logging in Express by modifying `server.js`.