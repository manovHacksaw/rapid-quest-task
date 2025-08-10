const Message = require("../models/Message");

// GET /api/conversations
const getConversations = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" },
          status: { $first: "$status" }
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
};

// GET /api/messages/:wa_id
const getMessagesByUser = async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// POST /api/messages
const sendMessage = async (req, res) => {
  try {
    const { wa_id, name, text } = req.body;

    const newMessage = new Message({
      id: `frontend-${Date.now()}`,
      wa_id,
      name,
      text,
      timestamp: `${Math.floor(Date.now() / 1000)}`,
      status: "sent"
    });

    await newMessage.save();

    // Real-time update will be handled by MongoDB change stream
    // No need to emit here as watchMessages in app.js will handle it

    res.status(201).json({ message: "Message stored successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ error: "Failed to store message" });
  }
};

const deleteMessage = async (req, res, io) => {
  try {
    const messageId = req.params.id;
    const messageToDelete = await Message.findOne({ id: messageId });

    if (!messageToDelete) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Perform the deletion
    await Message.deleteOne({ id: messageId });

    // Emit an event to all clients that a message was deleted
    // We emit from here because the 'delete' change stream event doesn't contain the full document
    io.emit('messageDeleted', messageToDelete);
    
    console.log(`✅ Emitted 'messageDeleted' and deleted message: ${messageId}`);
    res.status(200).json({ message: "Message deleted successfully", data: messageToDelete });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Failed to delete message" });
  }
};

module.exports = {
  getConversations,
  getMessagesByUser,
  sendMessage,
  deleteMessage
};
