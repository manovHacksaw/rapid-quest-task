const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const express = require("express");
const messageRoutes = require("./routes/message")
const cors = require("cors")

require('dotenv').config();
const Message = require('./models/Message'); 

const payloadDir = path.join(__dirname, 'messages'); // Make sure folder is correct
const app = express();
const PORT = process.env.PORT || 5000;

let data = []; // ✅ this should be an array

app.use(cors({
  origin: "http://localhost:3000",
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true 
}));
app.use(express.json());



// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas successfully");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err);
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

app.use("/api",messageRoutes );



// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

// Initialize 
connectDB();
processPayloads();
