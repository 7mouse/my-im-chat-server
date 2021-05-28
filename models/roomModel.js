const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
  roomType: {
    type: Number,
    required: true,
    default: 0 //0: 1v1, 1:1vN
  },
  createdTime: {
    type: Number,
    default: Date.now()
  },
  messageList: {
    type: Array,
    default: []
  },
  creator: {
    type: String
  },
  users: {
    type:Array,
    default: []
  },
  isDelect: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('rooms', RoomSchema);
