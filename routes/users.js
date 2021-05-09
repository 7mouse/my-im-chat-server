const { login, register, getUserinfo } = require('../controller/user');

const multer = require('@koa/multer');
const loggedCheck = require('../middlewares/loggedCheck');
const { SuccessModel } = require('../utils/resModel');
const userModel = require('../models/userModel');
const upload = multer({dest: 'uploads/'});

const router = require('koa-router')();

const allowCORS = async (ctx, next) => {
  console.log(ctx.request.origin);
  ctx.set("Access-Control-Allow-Origin", "http://localhost:3000");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  await next();
};

router.post('/login',
  allowCORS,
  login
);
 
router.post('/register',
  allowCORS,
  register
);

router.post('/logout',
  allowCORS, 
  loggedCheck,
  async (ctx) => {
    // 删除session 退出登陆
    console.log(ctx.session.userId)
    let res = await userModel.updateOne({ _id: ctx.session.userId }, { status: 0 });
    console.log(res);
    if (res) {
      ctx.session = null;
      ctx.body = new SuccessModel("退出成功");
    } else {
      ctx.body = new SuccessModel("退出失败");  
    }
  }
)

router.post('/islogged', 
  allowCORS,
  loggedCheck,
  async (ctx) => {
    ctx.body = new SuccessModel( "登录成功", {username: ctx.session.username});
    ctx.response.status = 200;
  }
)

router.get('/userinfo',
  allowCORS,
  loggedCheck,
  getUserinfo  
)

module.exports = router
