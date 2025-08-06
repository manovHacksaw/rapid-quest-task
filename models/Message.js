
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  wa_id: String,
  name: String,
  text: String,
  timestamp: String,
  status: String
}, { collection: 'processed_messages' });

module.exports = mongoose.model('Message', messageSchema);
