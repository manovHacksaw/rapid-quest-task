// File: services/payloadProcessor.js
const fs = require('fs');
const path = require('path');
const Message = require('../models/Message');

const payloadDir = path.join(__dirname, '..', 'messages');

const processPayloads = async () => {
  if (!fs.existsSync(payloadDir)) {
    console.warn(`⚠️ Payload directory not found at ${payloadDir}. Skipping.`);
    return;
  }
  const files = fs.readdirSync(payloadDir);
  console.log(`📂 Found ${files.length} files in the messages directory.`);

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(payloadDir, file), "utf-8");
      const json = JSON.parse(content);

      const change = json.metaData?.entry?.[0]?.changes?.[0];
      const value = change?.value;
      if (!value) continue;

      // Insert New Messages
      if (value.messages && Array.isArray(value.messages)) {
        const contact = value.contacts?.[0];
        for (const msg of value.messages) {
          if (await Message.findOne({ id: msg.id })) {
            console.log(`⚠️ Message ${msg.id} already exists. Skipping.`);
            continue;
          }
          const message = new Message({
            id: msg.id,
            wa_id: contact?.wa_id,
            name: contact?.profile?.name,
            text: msg.text?.body || '',
            timestamp: msg.timestamp,
            status: 'sent'
          });
          await message.save();
          console.log(`✅ Inserted message: ${msg.id}`);
        }
      }

      // Update Statuses
      if (value.statuses && Array.isArray(value.statuses)) {
        for (const status of value.statuses) {
          const updated = await Message.findOneAndUpdate(
            { id: status.id },
            { $set: { status: status.status } },
            { new: true } // option to return the updated doc
          );
          if (updated) {
            console.log(`🔁 Updated message ${status.id} to status: ${status.status}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }

  console.log("✅ Finished processing all payloads.");
};

module.exports = { processPayloads };