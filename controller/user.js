const crypto = require('crypto');
const mongoose = require('mongoose');
const messageModel = require('../models/messageModel');
const roomModel = require('../models/roomModel');
const userModel = require('../models/userModel');
const { SuccessModel, ErrorModel } = require('../utils/resModel');

async function login (ctx, next) {
  const hash = crypto.createHash("sha256", "MY_SECRET_KEY");
  const {username: name, password: pswd} = JSON.parse(ctx.request.body);
  const res = await userModel.findOne({username:name,  password: hash.update(pswd).digest("hex")});
  console.log(res)
  if (res === null) {
    ctx.body = new ErrorModel("用户不存在");
    ctx.response.status = 401;
  }
  else if (res && res.status === 0) {
    ctx.session.username = res.username;
    ctx.session.userId = res._id;
    // await userModel.updateOne({ _id: res._id }, { status: 1 });
    
    let rooms = [];
    for (let i = 0; i < res.rooms.length; i++) {
      const {username, userinfo, avatarUrl} = await userModel.findOne({_id: res.rooms[i].objUserId});
      const room = await roomModel.findOne({_id: res.rooms[i].roomId});
      const msgList = [];
      for (let i = 0; i < room.messageList.length; i++) {  
        let msgId = mongoose.Types.ObjectId(room.messageList[i]);
        let msg = await messageModel.findOne({_id: msgId});
        msgList.push({
          content: msg.content,
          contentType: msg.contentType,
          createdTime: msg.createdTime,
          sender: msg.sender,
          receiver: msg.receiver
        });
      }
      room.messageList = msgList;
      rooms.push({
        room: room,
        user:[{username, userinfo, avatarUrl}]
      });
    }
    ctx.response.status = 200;
    ctx.body = new SuccessModel( "登录成功", {
      username: res.username,
      userinfo: res.userinfo,
      avatarUrl: res.avatarUrl,
      rooms: rooms
    });
  } else if (res.status === 1) {
    ctx.body = new ErrorModel("用户已登录");
    ctx.response.status = 401;
  } else {
    ctx.body = new ErrorModel("登陆失败");
    ctx.response.status = 401;
  }
}

async function register(ctx) {
  const hash = crypto.createHash("sha256", "MY_SECRET_KEY");
  const {username: name, password: pswd, email: email} = JSON.parse(ctx.request.body);
  const isSaved = await userModel.findOne({username:name});
  // console.log("isSaved", isSaved);
  if (isSaved) {
    ctx.body = new ErrorModel("用户名重复");
    ctx.response.status = 401;
  }
  else {
    const res = await userModel.insertMany({
      username: name,
      password: hash.update(pswd).digest("hex"),
      email:email,
      status: 0,
      rooms: [],
      userinfo: ""
    });

    if (res) {
      ctx.body = new SuccessModel("注册成功");
      ctx.response.status = 200;
    } else {
      ctx.body = new ErrorModel("注册失败");
      ctx.response.status = 401;
    }
    
  }
}

async function getUserinfo(ctx) {
  const query = ctx.query;
  const user = await userModel.findOne({username:query.name});
  // ctx.body = new SuccessModel("查询成功", {
  //   user: username,
  // });
}

async function setUserinfo(ctx) {
  let req = (JSON.parse(ctx.request.body));
  let res = await userModel.updateOne({username: req.username}, {
    avatarUrl: req.avatarUrl,
    userinfo: req.userinfo
  });
  ctx.body = new SuccessModel("设置成功");
}

async function getUser(ctx) {
  const { username } = ctx.params;
  const user = await userModel.findOne({username:username.slice(9)});
  ctx.body = new SuccessModel("查询成功", {
    user: username,
    userinfo: user.userinfo
  });
}

async function addUserRoom(ctx) {
  const thisUser = ctx.session.username;
  const addUser = JSON.parse(ctx.request.body).username;
  if (thisUser === addUser) {
    ctx.body = new ErrorModel("不能添加自己");
    ctx.response.status = 401;
  } else {
    const user = await userModel.findOne({username:addUser});
    if (user === null) {
      ctx.body = new ErrorModel("用户不存在");
      ctx.response.status = 401;      
    } else {
      let room = await roomModel.findOne({
        roomType: 0, 
        users: {
          $all: [thisUser, addUser]
        }
      })
      if (!room) {
        room = await roomModel.insertMany({
          roomType: 0,
          creator: thisUser,
          users: [thisUser, addUser],
        });
        room = room[0];
        const thisUserId = mongoose.Types.ObjectId(ctx.session.userId);
        // return;
        await userModel.updateOne({username: thisUser}, {
          $addToSet: {
            "rooms": {
              roomId: room._id,
              objUserId: user._id
            }
          }
        });
        await userModel.updateOne({username: addUser}, {
          $addToSet: {
            "rooms": {
              roomId: room._id,
              objUserId: thisUserId
            }
          }
        });
        ctx.body = new SuccessModel("添加成功");
        ctx.response.status = 200; 
      } else {
        ctx.body = new SuccessModel("已是好友");
        ctx.response.status = 200; 
      }
    }
  }
}

module.exports = {
  login,
  register,
  getUserinfo,
  setUserinfo,
  getUser,
  addUserRoom
}