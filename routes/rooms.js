const { login, register, getUserinfo, getUser, setUserinfo, addUserRoom } = require('../controller/user');

const multer = require('@koa/multer');
const loggedCheck = require('../middlewares/loggedCheck');
const { SuccessModel } = require('../utils/resModel');
const userModel = require('../models/userModel');
const upload = multer({dest: 'uploads/'});

const router = require('koa-router')();

const allowCORS = async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://localhost:3000");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  await next();
};

router.post('/adduser', async (ctx, next)=>{
  
  await next();
})
router.post('/addroom', async (ctx, next)=>{

  await next();
})
// router.post('/addroom', async (ctx, next)=>{

//   await next();
// })

module.exports = router
