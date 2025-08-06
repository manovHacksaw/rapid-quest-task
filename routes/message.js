const express = require("express");
const router = express.Router();
const {
  getConversations,
  getMessagesByUser,
  sendMessage
} = require("../controllers/message");

router.get("/conversations", getConversations);
router.get("/messages/:wa_id", getMessagesByUser);
router.post("/messages", sendMessage);

module.exports = router;
