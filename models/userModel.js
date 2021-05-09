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
  }
});

module.exports = mongoose.model('users', UserSchema);
