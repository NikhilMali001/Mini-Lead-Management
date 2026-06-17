# Mini Lead Management System

This repository contains a full-stack Mini Lead Management System built with Node.js, Express, MySQL, and React. It implements role-based authentication, lead management, auto-assignment of leads to agents, and front-end pages for login, dashboards, and lead CRUD.

## Architecture

- `backend/`: Express API.
- `frontend/`: React single-page application.
- `backend/src/routes/`: HTTP endpoint routing.
- `backend/src/controllers/`: Request handling logic.
- `backend/src/services/`: Business logic and authorization.
- `backend/src/models/`: Database access layer.
- `backend/src/middleware/`: Auth and role middleware.

## Setup Instructions

### Backend

1. Open a terminal in `backend/`.
2. Copy `.env.example` to `.env`.
3. Set `DATABASE_URL` to your MySQL connection string.
4. Ensure MySQL is installed and the database exists or let migrations create it.
5. Run:
   ```bash
   npm install
   npm run db:init
   npm run dev
   ```

### Frontend

1. Open a terminal in `frontend/`.
2. Run:
   ```bash
   npm install
   npm run dev
   ```

### Database Setup

1. Create a MySQL database user and ensure your MySQL server is running.
2. Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and `JWT_SECRET`.
3. Run the migration script from the backend folder:
   ```bash
   cd backend
   npm run db:init
   npm run db:seed
   ```

Seeded default credentials:
- Admin: `admin@example.com` / `Admin@123`
- Manager: `manager@example.com` / `Manager@123`
- Agent: `agent@example.com` / `Agent@123`

If you prefer running the SQL directly, use your MySQL client:
   ```bash
   mysql -u username -p < backend/src/db/migrations.sql
   ```

### Troubleshooting

- If `npm run db:init` fails with `ECONNREFUSED`, MySQL is not running or the connection string is incorrect.
- Install MySQL and start the service.
  - On Windows, use the installer from https://dev.mysql.com/downloads/mysql/.
  - Ensure the database name, user, and password match `DATABASE_URL`.
- If `mysql` is not found, add MySQL's `bin` folder to your PATH or use the installer.

## Backend API

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Leads

- `GET /api/leads`
- `GET /api/leads/:id`
- `POST /api/leads`
- `PUT /api/leads/:id`
- `DELETE /api/leads/:id`

List endpoint supports pagination, search, sorting, and filters:
- `page`, `limit`, `search`, `status`, `source`, `sort`, `order`
- `GET /api/activities` (admin only)


## Role Behavior

- `admin`: full lead access and full details.
- `manager`: create/update/delete leads; all lead access.
- `agent`: only assigned leads; limited actions.

## File Responsibilities

### Backend

- `backend/src/index.js`: loads environment variables, initializes the database, and starts the server.
- `backend/src/app.js`: configures Express, middleware, and routes.
- `backend/src/config/db.js`: MySQL pool configuration.
- `backend/src/config/jwt.js`: JWT secret and expiration values.
- `backend/src/middleware/auth.js`: authenticates JWT bearer tokens.
- `backend/src/middleware/roles.js`: enforces role authorization.
- `backend/src/controllers/auth.controller.js`: routes for registration, login, and logout.
- `backend/src/controllers/lead.controller.js`: routes for lead operations.
- `backend/src/services/auth.service.js`: user hashing, login, and token creation.
- `backend/src/services/lead.service.js`: lead business logic and assignment.
- `backend/src/models/user.model.js`: user data queries.
- `backend/src/models/lead.model.js`: lead queries, filters, and auto-assignment.
- `backend/src/models/activity.model.js`: activity logging.
- `backend/src/db/migrations.sql`: table schema and indexes.

### Frontend

- `frontend/src/main.jsx`: app bootstrap and router setup.
- `frontend/src/App.jsx`: client-side routing and protected routes.
- `frontend/src/api/api.js`: fetch helper with JWT support.
- `frontend/src/context/AuthContext.jsx`: auth state, login, register, and token storage.
- `frontend/src/components/NavBar.jsx`: top navigation with role-sensitive links.
- `frontend/src/components/PrivateRoute.jsx`: guard for authenticated routes.
- `frontend/src/pages/LoginPage.jsx`: login form and validation.
- `frontend/src/pages/RegisterPage.jsx`: registration with role selection.
- `frontend/src/pages/DashboardPage.jsx`: role-specific dashboard summary.
- `frontend/src/pages/LeadListPage.jsx`: paginated lead table with filters.
- `frontend/src/pages/LeadFormPage.jsx`: create/edit lead form.
- `frontend/src/pages/LeadDetailsPage.jsx`: lead detail view.
- `frontend/src/pages/NotFoundPage.jsx`: fallback page.

## How to Use

1. Run backend on `http://localhost:4000`.
2. Run frontend on `http://localhost:5173`.
3. Register a user and choose a role.
4. Login and navigate to dashboard or leads.
5. Create leads as manager/admin and verify auto-assignment to agents.

## Notes

- The app uses JWT for authentication.
- Leads are auto-assigned to the least-loaded agent.
- Agents only see assigned leads; managers and admins see all leads.
- The backend enriches lead creation using an external company information API for observability.
- The frontend is built with React and Bootstrap for responsive UI.


