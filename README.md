## Streamify

Modern video library app built with React (Vite) on the frontend and Express + MongoDB on the backend.

### Tech stack
- **Frontend**: React 19, Vite 7, React Router, ESLint
- **Backend**: Node.js, Express 4, Mongoose 8
- **Database**: MongoDB

### Monorepo layout
```
Streamify/
  backend/    # Express API + MongoDB, serves production frontend from backend/public
  frontend/   # React + Vite app (dev server, build to dist/)
```

## Prerequisites
- Node.js LTS (18+ recommended)
- MongoDB running locally or remotely

## Setup
1) Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

2) Configure environment variables in `backend/.env`
```bash
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/streamify

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=1h

# Server Configuration
PORT=5000
```

3) Seed an admin user (either command works)
```bash
# Option A
cd backend
node test-db.js

# Option B
cd backend
npm run create-admin
```

Default admin:
- Email: `admin@streamify.com`
- Password: `test1`
- Role: `admin`

## Running in development
### Start backend
```bash
cd backend
node server.js
```

### Start frontend (Vite dev server)
```bash
cd frontend
npm run dev
```

Vite is configured to proxy API calls from `/api` to `http://localhost:5000` (see `frontend/vite.config.js`).

### Optional: run both with one command (concurrently)
The backend has a `dev` script wired to run both frontend and backend concurrently. It expects a `start` script to be present.

Add a start script once (if missing):
```bash
cd backend
npm pkg set scripts.start="node server.js"
```

Then you can run:
```bash
cd backend
npm run dev
```

## API overview
Base URL in dev: `http://localhost:5000/api`

### Auth
- POST `/auth/login`
  - Body: `{ email, password, role }`
  - Returns: `{ token, user }`

- POST `/auth/register`
  - Body: `{ email, fullname, password }`
  - Returns: `{ message, token, user }`

### Videos
- GET `/videos`
  - Returns: `Video[]` (newest first, author populated with `email`, `fullname`)

- POST `/videos`
  - Body: `{ title, description, videoUrl, author }`
  - Returns: `{ message, video }`

- DELETE `/videos/:id`
  - Returns: `{ message }`

### Users
- GET `/users/count`
  - Returns: `{ count }`

- GET `/users`
  - Returns: `User[]` (fields: `email`, `fullname`, `role`)

## Building and serving production
In production, the Express server serves the built frontend from `backend/public`.

1) Build the frontend
```bash
cd frontend
npm run build
```

2) Copy the build output to `backend/public`

Windows PowerShell example:
```powershell
cd frontend
npm run build
New-Item -ItemType Directory -Force ..\backend\public | Out-Null
Remove-Item -Recurse -Force ..\backend\public\* -ErrorAction SilentlyContinue
Copy-Item -Recurse -Force dist\* ..\backend\public\
```

3) Start the backend server
```bash
cd backend
node server.js
```

Open `http://localhost:5000` to access the app (API continues to be available under `/api`).

## Troubleshooting
- Mongo connection errors: verify `MONGO_URI` and that MongoDB is running.
- CORS issues: backend allows `http://localhost:5173`, `5174`, and `5000` by default.
- Admin login fails: seed the admin via `node backend/test-db.js` or `npm run create-admin`.

## Security notes
- Passwords are stored as plain text in the current demo setup. Do not use in production; integrate `bcrypt` and proper hashing before deploying.
- Replace `JWT_SECRET` with a strong secret in production and rotate it periodically.

## License
ISC

# Streamify
Streamify is an Online Content Management System
