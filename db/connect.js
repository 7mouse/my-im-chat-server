const mongoose = require('mongoose');

// const DB_URL = 'mongodb+srv://7Mouse:951753@cluster0.ds3gx.mongodb.net/Nodejs-SSO?retryWrites=true&w=majority'
const DB_URL = "mongodb://127.0.0.1:27017/SSO"

const connect = () => {
  mongoose.connect(DB_URL, err => {
    if (err) {
      console.log('===> Error connecting to mongoDB');
      console.log(`Reason: ${err}`)
    } else {
      console.log('===> Succeeded in connecting to mongoDB');
    }
  });
  return mongoose.connection;
};


mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

module.exports = connect(); 