const crypto = require('crypto');
const userModel = require('../models/userModel');
const { SuccessModel, ErrorModel } = require('../utils/resModel');

async function login (ctx, next) {
  const hash = crypto.createHash("sha256", "MY_SECRET_KEY");
  const {username: name, password: pswd} = JSON.parse(ctx.request.body);
  const res = await userModel.findOne({username:name,  password: hash.update(pswd).digest("hex")});
  console.log(res, res.status, res.username, res.createdTime);
  if (res && res.status === 0) {
    ctx.session.username = res.username;
    ctx.session.userId = res._id;
    await userModel.updateOne({ _id: res._id }, { status: 1 });
    ctx.body = new SuccessModel( "登录成功", ctx.session.username);
    ctx.response.status = 200;
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
  console.log("isSaved", isSaved);
  if (isSaved) {
    ctx.body = new ErrorModel("用户名重复");
    ctx.response.status = 401;
  }
  const res = await userModel.insertMany({username: name, password: hash.update(pswd).digest("hex"), email:email, status: 1});

  if (res) {
    ctx.session.username = res.username;
    ctx.session.userId = res._id;
    ctx.body = new SuccessModel("注册成功")
    ctx.response.status = 200;
  } else {
    ctx.body = new ErrorModel("注册失败");
    ctx.response.status = 401;
  }
}

async function getUserinfo(ctx) {
  const query = ctx.query;
  const user = await userModel.findOne({username:query.name});
  ctx.body = new SuccessModel("查询成功", {
    user: username
  });
}

module.exports = {
  login,
  register,
  getUserinfo
}