const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdTime: {
    type: Number,
    default: Date.now()
  },
  email: {
    type: String,
    require: true
  },
  status: {
    type: Number,
    default: 0
  },
  rooms: {
    type: Array,
    default: []
  },
  userinfo: {
    type: String,
    default: "这个用户什么都没有留下..."
  },
  avatarUrl: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model('users', UserSchema);
