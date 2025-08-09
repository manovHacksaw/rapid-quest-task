const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const express = require("express");
const messageRoutes = require("./routes/message")
const cors = require("cors")
const { createServer } = require('http');
const { Server } = require('socket.io');

require('dotenv').config();
const Message = require('./models/Message'); 

const payloadDir = path.join(__dirname, 'messages'); // Make sure folder is correct
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://2xbrt7r7-3000.inc1.devtunnels.ms"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

let data = []; // ✅ this should be an array

const allowedOrigins = [
  'http://localhost:3000',
  'https://2xbrt7r7-3000.inc1.devtunnels.ms'
]

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json());


io.on("connection", (socket)=>{
  console.log("A user has connected now: ", socket.id)

  socket.on("user-message", message =>{
    console.log("A new user has texted: ", message)
    io.emit("message-received", message)

    // For testing: simulate a new message event
    const testMessage = {
      id: `test-${Date.now()}`,
      wa_id: 'test_user',
      name: 'Test User',
      text: message,
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      status: 'sent'
    };

    // Emit newMessage event to test real-time functionality
    setTimeout(() => {
      console.log("📨 Emitting test newMessage:", testMessage);
      io.emit("newMessage", testMessage);
    }, 1000);
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
})

const watchMessages = (socketIo) => {
  // CORRECTED: Changed `required` to `whenAvailable`. This prevents the stream
  // from crashing if a pre-image isn't available for an 'update' event.
  const changeStream = Message.watch([], {
    fullDocument: 'updateLookup',
    fullDocumentBeforeChange: 'whenAvailable'
  });

  changeStream.on('change', (change) => {
    console.log('Database change detected:', change.operationType);

    try {
      switch (change.operationType) {
        case 'insert':
          socketIo.emit('newMessage', change.fullDocument);
          break;
        case 'update':
          socketIo.emit('messageUpdated', change.fullDocument);
          break;
        case 'delete':
          // ADDED: A guard clause to ensure we only proceed if the pre-image exists.
          if (change.fullDocumentBeforeChange) {
            socketIo.emit('messageDeleted',  change.documentKey._id.toString());
          } else {
            console.warn(`A document was deleted, but its pre-image was not available. Can't emit 'messageDeleted'.`);
          }
          break;
      }
    } catch (err) {
      console.error("Error processing change stream event:", err);
    }
  });

  changeStream.on('error', (err) => {
    // This listener will now catch other errors without crashing on pre-image issues.
    console.error('Change Stream Error:', err);
  });
};

// MongoDB Connection
async function connectDB() {
  try {
    // Set timeout for MongoDB connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/whatsapp-processor', {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      connectTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB successfully");
    watchMessages(io);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    console.log("ℹ️ Continuing without MongoDB - real-time features may be limited");
  }
}


// Webhook Payload Loader
async function processPayloads() {
  const files = fs.readdirSync(payloadDir);
  console.log("Files inside the messages directory: ", files);

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(payloadDir, file), "utf-8");
      const json = JSON.parse(content);

      data.push(json); // Still keep this for debug

      const change = json.metaData?.entry?.[0]?.changes?.[0];
      const value = change?.value;

      if (!value) continue;

      // ✅ Insert New Messages
      if (value.messages && Array.isArray(value.messages)) {
        const contact = value.contacts?.[0];
        const wa_id = contact?.wa_id;
        const name = contact?.profile?.name;

        for (const msg of value.messages) {
          const existing = await Message.findOne({ id: msg.id });
          if (existing) {
            console.log(`⚠️ Message ${msg.id} already exists. Skipping.`);
            continue;
          }

          const message = new Message({
            id: msg.id,
            wa_id,
            name,
            text: msg.text?.body || '',
            timestamp: msg.timestamp,
            status: 'sent'
          });

          await message.save();
          console.log(`✅ Inserted message: ${msg.id}`);
        }
      }

      // ✅ Update Statuses
      if (value.statuses && Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          const msgId = status.id || status.meta_msg_id;
          const newStatus = status.status;

          const updated = await Message.findOneAndUpdate(
            { id: msgId },
            { $set: { status: newStatus } }
          );

          if (updated) {
            console.log(`🔁 Updated message ${msgId} to status: ${newStatus}`);
          } else {
            console.log(`❓ Message ${msgId} not found for status update`);
          }
        }
      }

    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error.message);
    }
  }

  console.log("✅ Finished processing all payloads.");
}

// API Routes
app.get("/", (req, res) => {
  res.json(data); // ✅ serve entire loaded data
});

// Middleware to pass io instance to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api", messageRoutes);





// Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} with socket.io`);
});

// Initialize 
connectDB();
processPayloads();
