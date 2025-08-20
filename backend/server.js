const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // NEW: Import the 'path' module
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

const app = express();

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5000'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Express 5 compatible preflight route
app.options('/api/*', cors(corsOptions));

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies


// NEW: Serve static files from the 'public' folder ---------------------
// This is where the Dockerfile will place your built frontend assets.
app.use(express.static(path.join(__dirname, 'public')));
// --------------------------------------------------------------------


// API Routes (These should come AFTER the static middleware)
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});


// NEW: Catch-all route to serve the frontend's index.html ------------
// This is for Single Page Applications (SPAs) like React. It ensures that
// if you refresh the page on a route like '/dashboard', the server still
// sends the main HTML file, letting the frontend handle the routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// --------------------------------------------------------------------


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // Note: Inside Docker, it won't be 'localhost', but this log is fine.
  console.log(`Backend server running on port ${PORT}`);
});