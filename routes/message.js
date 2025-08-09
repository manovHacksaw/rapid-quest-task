const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessagesByUser,
  sendMessage,
  deleteMessage
} = require("../controllers/message");

router.get("/conversations", getConversations);
router.get("/messages/:wa_id", getMessagesByUser);
router.post("/messages", sendMessage);
router.delete("/messages/:id", (req, res) => {
  // Pass the io instance from app.js context
  deleteMessage(req, res, req.io);
});


module.exports = router;
