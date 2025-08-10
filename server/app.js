const express = require('express');
const { createServer } = require('http');
const cors = require('cors');

const config = require('./config');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/message');
const { initializeSocket } = require('./services/socketManager');
const { processPayloads } = require('./services/payloadProcessor');

// Initialize App
const app = express();
const server = createServer(app);

// --- Middleware ---
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || config.CORS_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// --- Initialize Socket.IO ---
const io = initializeSocket(server);

// Middleware to pass io instance to routes if needed
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- API Routes ---
app.use('/api/messages', messageRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is running. Use /api/messages to get data." });
});


// --- Start Server and Services ---
const startServer = async () => {
  try {
    // 1. Connect to the database
    await connectDB();

    // 2. Start the Express server
    server.listen(config.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${config.PORT}`);
    });

    // 3. Process initial data (can run in the background)
    processPayloads();

  } catch (error) {
    console.error("❌ Failed to start the server:", error);
    process.exit(1); // Exit if critical services fail
  }
};

startServer();