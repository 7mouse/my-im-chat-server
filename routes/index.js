const userRouter = require('./users')
const roomRouter = require('./rooms')
const {SuccessModel} = require('../utils/resModel');
const router = require('koa-router')()

// app.use(async (ctx, next) =>  {
//   ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
//   ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//   ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
//   await next();
// })

router.post('/', async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
  ctx.set("Access-Control-Allow-Credentials", "true");
  ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
  await next();
},
async (ctx, next) => {
  // 删除session 退出登陆
  // ctx.session.view++;
  // await ctx.session.manuallyCommit();;
  console.log(ctx.response.header);
  if (ctx.session.isNew) console.log("New");
  else console.log("notNew")
  // console.log(ctx.session.view)
  // if (ctx.session.view === 9) {
  //   ctx.session = null;
  // }
  ctx.body = new SuccessModel("测试成功");
}
)

router.use('/user', userRouter.routes(), userRouter.allowedMethods())
router.use('/room', roomRouter.routes(), roomRouter.allowedMethods())
module.exports = router
