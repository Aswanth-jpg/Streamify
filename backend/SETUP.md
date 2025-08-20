# Streamify Backend Setup Guide

## Prerequisites
- Node.js installed
- MongoDB running locally or accessible

## Environment Variables
Create a `.env` file in the backend directory with:

```bash
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/streamify

# JWT Configuration  
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=1h

# Server Configuration
PORT=5000
```

## Database Setup
1. Ensure MongoDB is running
2. Run the test script to create admin user:
   ```bash
   node test-db.js
   ```

## Admin User Credentials
- Email: admin@streamify.com
- Password: test1
- Role: admin

## Start the Server
```bash
npm start
```

## Test Login
Use the admin credentials above in the frontend login form.

