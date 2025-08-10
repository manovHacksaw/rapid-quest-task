
const { Server } = require('socket.io');
const config = require('../config');
const Message = require('../models/Message');

let io;

const watchMessages = () => {
  const changeStream = Message.watch([], {
    fullDocument: 'updateLookup',
    fullDocumentBeforeChange: 'whenAvailable'
  });

  changeStream.on('change', (change) => {
    console.log('Database change detected:', change.operationType);
    try {
      switch (change.operationType) {
        case 'insert':
          io.emit('newMessage', change.fullDocument);
          break;
        case 'update':
          io.emit('messageUpdated', change.fullDocument);
          break;
      }
    } catch (err) {
      console.error("Error processing change stream event:", err);
    }
  });

  changeStream.on('error', (err) => {
    console.error('Change Stream Error:', err);
  });
};

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: config.CORS_ORIGINS,
      methods: ["GET", "POST"],
    }
  });

  io.on("connection", (socket) => {
    console.log("A user has connected: ", socket.id);

    // This is for front-end testing. A real user message would be saved to the DB
    // and picked up by the change stream instead.
    socket.on("user-message", messageText => {
      console.log("A new user has sent a test message: ", messageText);
      const testResponse = {
        id: `frontend-test-${Date.now()}`,
        wa_id: 'frontend_user',
        name: 'Frontend User',
        text: `Echo: ${messageText}`,
        timestamp: `${Math.floor(Date.now() / 1000)}`,
        status: 'sent'
      };
      io.emit("message-received", testResponse); // Acknowledge test message
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  
  // Start watching for database changes once the socket server is up
  watchMessages();

  return io;
};

module.exports = { initializeSocket };