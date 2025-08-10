# WhatsApp Web Clone

A full-stack WhatsApp Web clone built as a Full Stack Developer Evaluation Task. This application simulates a WhatsApp Web interface with real-time messaging capabilities, webhook payload processing, and a responsive design that works seamlessly on both desktop and mobile devices.

## 🔗 Live Demo

- **Frontend (Client):** [https://whatsapp-web-clone-murex.vercel.app](https://whatsapp-web-clone-murex.vercel.app)
- **Backend (API):** Deployed on Render [https://whatsapp-web-rapid-quest-task.onrender.com](https://whatsapp-web-rapid-quest-task.onrender.com)

## 📋 Project Overview

This project was developed as part of a Full Stack Developer Evaluation Task with the following requirements:

### Task Requirements ✅

- ✅ **Task 1: Webhook Payload Processor** - Process WhatsApp Business API webhook payloads and store messages in MongoDB
- ✅ **Task 2: WhatsApp Web-Like Interface** - Responsive UI that mimics WhatsApp Web with conversation lists and chat interface
- ✅ **Task 3: Send Message Demo** - Message input functionality that saves to database (demo only)
- ✅ **Task 4: Deployment** - Fully deployed application accessible via public URLs
- ✅ **Bonus: Real-Time Interface** - WebSocket implementation using Socket.IO for real-time updates

## 🏗️ Architecture

```
├── client/          # Next.js 15 Frontend (React 19)
├── server/          # Node.js Backend with Express
└── README.md        # This file
```

### Technology Stack

**Frontend:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Socket.IO Client
- Lucide React Icons

**Backend:**
- Node.js with Express
- MongoDB with Mongoose
- Socket.IO for real-time communication
- CORS enabled
- RESTful APIs

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or MongoDB Atlas)
- npm/yarn/pnpm

### 1. Clone the repository
```bash
git clone <repository-url>
cd whatsapp-web-clone
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.local.example .env.local  # Configure your environment variables
npm run dev
```

### 4. Access the application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔧 Environment Configuration

### Server (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/whatsapp-processor
# or MongoDB Atlas connection string
```

### Client (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 📱 Features

### Core Features
- **Real-time Messaging**: Instant message delivery using WebSocket
- **Conversation Management**: Group messages by user (wa_id)
- **Message Status Tracking**: Sent, delivered, read indicators
- **Responsive Design**: Mobile-first approach, works on all devices
- **Search Functionality**: Search through conversations and messages
- **WhatsApp-like UI**: Accurate recreation of WhatsApp Web interface

### Technical Features
- **Webhook Processing**: Automatic processing of WhatsApp Business API payloads
- **Database Integration**: MongoDB for message storage and retrieval
- **RESTful APIs**: Clean API endpoints for data operations
- **Socket.IO Integration**: Real-time bidirectional communication
- **Error Handling**: Comprehensive error handling and loading states
- **TypeScript**: Fully typed for better development experience

## 📊 Database Schema

The application uses MongoDB with the following collection:

**Collection:** `processed_messages`
```javascript
{
  id: String,        // Unique message ID
  wa_id: String,     // WhatsApp ID (used for grouping conversations)
  name: String,      // Contact name
  text: String,      // Message content
  timestamp: String, // Message timestamp
  status: String     // Message status (sent, delivered, read)
}
```

## 🔄 Webhook Payload Processing

The application processes WhatsApp Business API webhook payloads with:
- **Message Processing**: Extracts and stores new messages
- **Status Updates**: Updates message delivery status using id/meta_msg_id
- **Duplicate Prevention**: Prevents duplicate message insertion
- **Error Handling**: Robust error handling for malformed payloads

## 🎨 UI/UX Features

### Desktop
- Three-panel layout (navigation, conversations, chat)
- Conversation search
- Message context menus
- Profile and settings pages
- Status indicators

### Mobile
- Responsive single-panel view
- Bottom navigation
- Swipe-friendly interface
- Mobile-optimized chat interface
- Touch-friendly interactions

## 🔒 Security & Best Practices

- CORS configuration for allowed origins
- Input validation and sanitization
- Error boundary implementation
- Secure database connections
- Environment variable management
- TypeScript for type safety

## 📈 Performance

- **Next.js 15**: Latest performance optimizations
- **Turbopack**: Fast refresh and builds
- **React 19**: Improved rendering performance
- **Efficient State Management**: Optimized React state updates
- **Socket.IO**: Efficient real-time communication

## 🧪 Testing

Run tests for both client and server:

```bash
# Frontend tests
cd client
npm run test

# Backend tests
cd server
npm run test
```

## 📦 Deployment

### Frontend (Vercel)
The frontend is deployed on Vercel with automatic deployments from the main branch.

### Backend (Render/Railway)
The backend is deployed on a cloud platform with MongoDB Atlas integration.

### Environment Variables
Make sure to configure the production environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Evaluation Criteria Met

- ✅ **UI Similarity**: Close recreation of WhatsApp Web interface
- ✅ **Mobile Responsiveness**: Fully responsive design
- ✅ **Attention to Detail**: Thoughtful UX considerations and edge cases
- ✅ **Backend Structure**: Well-organized, scalable backend architecture
- ✅ **Real-time Features**: Socket.IO implementation for live updates
- ✅ **Deployment**: Fully functional public URLs

## 📞 Support

For questions or support regarding this evaluation task, please refer to the individual README files in the `client/` and `server/` directories for more specific technical details.

## 📄 License

This project was created as part of a Full Stack Developer Evaluation Task.

---

**Note**: This is a simulation application. No real WhatsApp messages are sent or received. All functionality is for demonstration purposes only.
