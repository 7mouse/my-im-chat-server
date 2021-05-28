const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  contentType: {
    type: Number,
    required: true,
    default: 0 // 0: text, 1: image
  },
  createdTime: {
    type: Number,
    default: Date.now()
  },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('messages', MessageSchema);
