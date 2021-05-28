const RoomModel = require('../backend/models/roomModel')
const MessageModel = require('../backend/models/messageModel')

module.exports =  function socketio(server) {
  const io = require('socket.io')(server, {transports: ['websocket']});
  io.on('connection', socket => {
    socket.on("clientMsg", async (data)=>{
      let roomType = 0;
      if (data.receiver.startsWith("room") === true) {
        roomType = 1;
      }

      let room = await RoomModel.findOne({users: {$in: data.receiver}});
      if (!room) room = await RoomModel.insertMany({
        roomType: roomType,
        createdTime: Date.now(),
        creator: data.sender,
        users: [data.receiver, data.sender]
      });
      const msg = await MessageModel.insertMany({
        receiver: data.receiver,
        content: data.content,
        contentType: data.contentType,
        createTime: Date.now(),
        sender: data.sender
      });
      await RoomModel.updateOne({_id : room._id}, {
        $addToSet: {
          messageList: msg[0]._id
        }
      });
      if (roomType === 1) {
        // room.users.forEach(item=>{
        //   socket.emit('serverMsg', data);
        // })
      } else {
        socket.emit('serverMsg', data);
      }
    })
  })
}