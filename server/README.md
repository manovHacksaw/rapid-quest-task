# WhatsApp Web Clone - Backend

A robust Node.js backend server that processes WhatsApp Business API webhook payloads, manages real-time communication, and provides RESTful APIs for the WhatsApp Web clone frontend. Built with Express, MongoDB, and Socket.IO for handling messaging data and real-time features.

## 🔗 Live Demo

**Backend API:** Deployed on Render
**Database:** MongoDB Atlas cluster

## 🎯 Evaluation Task - Backend Implementation

This backend was built as part of a Full Stack Developer Evaluation Task, specifically addressing:

- ✅ **Webhook Payload Processing**: Process WhatsApp Business API webhook payloads
- ✅ **MongoDB Integration**: Store messages in `whatsapp.processed_messages` collection
- ✅ **Status Updates**: Update message status using id/meta_msg_id fields
- ✅ **RESTful APIs**: Clean API endpoints for frontend integration
- ✅ **Real-time Communication**: Socket.IO for live messaging
- ✅ **Production Deployment**: Cloud-hosted backend with public access

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.IO
- **Middleware**: CORS, Express JSON parser
- **Environment**: dotenv for configuration
- **Process Management**: Nodemon for development

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js                # MongoDB connection configuration
│   └── index.js             # Environment variables and settings
├── controllers/
│   └── message.js           # Message-related business logic
├── models/
│   └── Message.js           # MongoDB schema for messages
├── routes/
│   └── message.js           # API route definitions
├── services/
│   ├── payloadProcessor.js  # Webhook payload processing logic
│   └── socketManager.js     # Socket.IO connection management
├── messages/                # Sample webhook payload files
│   ├── conversation_1_message_1.json
│   ├── conversation_1_status_1.json
│   └── ...
├── app.js                   # Main application entry point
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or later
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/whatsapp-processor
# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
```

3. **Start the server**
```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

4. **Verify server is running**
Visit [http://localhost:5000](http://localhost:5000) - should return JSON response

### Database Setup

The application uses MongoDB with the following database structure:

**Database**: `whatsapp`
**Collection**: `processed_messages`

The MongoDB connection is automatically established on server startup.

## 📊 Database Schema

### Message Model (`models/Message.js`)

```javascript
{
  id: {
    type: String,
    required: true,
    unique: true      // Ensures no duplicate messages
  },
  wa_id: String,      // WhatsApp ID for grouping conversations
  name: String,       // Contact name from webhook payload
  text: String,       // Message content
  timestamp: String,  // Message timestamp from WhatsApp
  status: String      // Message status: 'sent', 'delivered', 'read'
}
```

**Collection**: `processed_messages` (explicitly defined for task requirements)

## 🔄 Webhook Payload Processing

### Sample Payload Structure

The system processes two types of WhatsApp Business API webhooks:

**1. Message Payload:**
```json
{
  "metaData": {
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{ ... }],
          "contacts": [{ ... }]
        }
      }]
    }]
  }
}
```

**2. Status Payload:**
```json
{
  "metaData": {
    "entry": [{
      "changes": [{
        "value": {
          "statuses": [{ 
            "id": "message_id",
            "status": "delivered"
          }]
        }
      }]
    }]
  }
}
```

### Processing Logic (`services/payloadProcessor.js`)

1. **Message Processing:**
   - Extract message data from webhook payload
   - Get contact information for name and wa_id
   - Check for existing message to prevent duplicates
   - Insert new message with 'sent' status

2. **Status Updates:**
   - Extract status information from webhook payload
   - Find message by ID and update status
   - Support for 'sent', 'delivered', 'read' statuses

3. **Error Handling:**
   - Graceful handling of malformed payloads
   - Logging for debugging and monitoring
   - Continue processing if individual payload fails

## 🌐 API Endpoints

### Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-deployed-url.com/api`

### Endpoints

#### 1. Get All Conversations
```http
GET /api/messages/conversations
```
**Response:** Array of conversation objects grouped by wa_id
```json
[
  {
    "_id": "1234567890",
    "name": "John Doe",
    "lastMessage": "Hello there!",
    "lastTimestamp": "1640995200",
    "status": "delivered"
  }
]
```

#### 2. Get Messages for Conversation
```http
GET /api/messages/:wa_id
```
**Response:** Array of messages for specific conversation
```json
[
  {
    "id": "msg_123",
    "wa_id": "1234567890",
    "name": "John Doe",
    "text": "Hello there!",
    "timestamp": "1640995200",
    "status": "delivered"
  }
]
```

#### 3. Get All Messages
```http
GET /api/messages
```
**Response:** Array of all messages (for search functionality)

#### 4. Send New Message
```http
POST /api/messages
Content-Type: application/json

{
  "wa_id": "1234567890",
  "name": "John Doe",
  "text": "New message text"
}
```
**Response:** Created message object

#### 5. Health Check
```http
GET /
```
**Response:** Server status confirmation

## 🔌 Socket.IO Real-time Events

### Server Events (Emitted to clients)

1. **newMessage**: Emitted when a new message is added
2. **messageUpdated**: Emitted when message status changes
3. **messageDeleted**: Emitted when a message is deleted

### Client Events (Received from clients)

Currently, the server primarily emits events. Client-side message sending uses REST API with Socket.IO notification.

### Socket Configuration (`services/socketManager.js`)

```javascript
const io = new Server(server, {
  cors: {
    origin: CORS_ORIGINS,
    methods: ["GET", "POST"]
  }
});

// Connection handling
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});
```

## 🔧 Configuration

### Environment Variables

```env
# Server Configuration
PORT=5000                    # Server port

# Database Configuration
MONGO_URI=mongodb://localhost:27017/whatsapp-processor

# For MongoDB Atlas (recommended for production)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp?retryWrites=true&w=majority
```

### CORS Configuration (`config/index.js`)

```javascript
CORS_ORIGINS: [
  "http://localhost:3000",                    # Local development
  "https://whatsapp-web-clone-murex.vercel.app", # Production frontend
  "https://2xbrt7r7-3000.inc1.devtunnels.ms"     # Development tunnel
]
```

## 🚀 Deployment

### Prerequisites for Deployment
- MongoDB Atlas cluster or cloud MongoDB instance
- Cloud hosting platform (Render, Railway, Heroku, etc.)
- Environment variables configured

### Deployment Steps

1. **Database Setup:**
   - Create MongoDB Atlas cluster
   - Configure network access and database user
   - Update `MONGO_URI` with Atlas connection string

2. **Platform Deployment:**
   ```bash
   # Build command (if needed)
   npm install
   
   # Start command
   npm start
   ```

3. **Environment Variables:**
   Configure in your hosting platform:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://...
   ```

4. **CORS Update:**
   Add your production frontend URL to `CORS_ORIGINS` in `config/index.js`

### Platform-Specific Guides

**Render:**
- Connect GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`
- Configure environment variables in dashboard

**Railway:**
- Connect GitHub repository
- Configure environment variables
- Deploy automatically on push

**Heroku:**
```bash
heroku create your-app-name
heroku config:set MONGO_URI=your-mongodb-uri
git push heroku main
```

## 🧪 Testing

### Manual Testing

1. **Health Check:**
```bash
curl http://localhost:5000/
```

2. **Get Conversations:**
```bash
curl http://localhost:5000/api/messages/conversations
```

3. **Send Message:**
```bash
curl -X POST http://localhost:5000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"wa_id":"1234567890","name":"Test User","text":"Test message"}'
```

### Payload Processing Test

The server automatically processes sample payloads in the `messages/` directory on startup. Check console output for processing results.

## 📈 Performance Considerations

### Database Optimization
- **Indexing**: Automatic index on `id` field for fast lookups
- **Connection Pooling**: Mongoose handles connection pooling
- **Query Optimization**: Efficient aggregation for conversations

### Memory Management
- **Payload Processing**: Processes files sequentially to avoid memory spikes
- **Socket Connections**: Proper cleanup on disconnect
- **Error Boundaries**: Prevents memory leaks from unhandled errors

### Scalability Features
- **Stateless Design**: Server can be horizontally scaled
- **Database Separation**: Easy to scale database independently
- **Socket.IO Scaling**: Can be configured with Redis adapter for multiple instances

## 🔒 Security

### Input Validation
- **Message Content**: Sanitization of user input
- **Payload Validation**: Validation of webhook payload structure
- **Database Queries**: Protection against injection attacks

### CORS Security
- **Origin Validation**: Restricted to known frontend URLs
- **Credentials**: Proper handling of cross-origin credentials

### Environment Security
- **Secrets Management**: Sensitive data in environment variables
- **Connection Security**: Secure MongoDB connection strings
- **Error Handling**: No sensitive data in error responses

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check MongoDB URI format
# Verify network access (MongoDB Atlas)
# Check database credentials
```

**Socket.IO Connection Issues:**
```bash
# Verify CORS configuration
# Check client socket URL
# Review browser network tab
```

**Payload Processing Errors:**
```bash
# Check messages/ directory exists
# Verify JSON file format
# Review console logs for specific errors
```

### Debug Mode

Enable detailed logging:
```bash
DEBUG=* npm run dev
```

### Log Analysis

Server logs include:
- Database connection status
- Payload processing results
- Socket.IO connection events
- API request/response details
- Error stack traces

## 📊 Monitoring

### Health Checks
- Database connectivity monitoring
- API endpoint response time tracking
- Socket.IO connection status

### Metrics to Track
- Message processing rate
- Database query performance
- Active Socket.IO connections
- API error rates

## 🤝 Contributing

1. Follow Node.js best practices
2. Add error handling for new features
3. Update API documentation
4. Test with sample webhook payloads
5. Ensure MongoDB compatibility

## 📞 Support

For backend-specific issues:
1. Check server logs for errors
2. Verify MongoDB connection
3. Test API endpoints individually
4. Review Socket.IO connection status
5. Validate webhook payload format

---

This backend implementation provides a solid foundation for the WhatsApp Web clone, meeting all evaluation criteria while following Node.js and Express.js best practices.
