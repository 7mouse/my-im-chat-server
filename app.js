const Koa = require('koa')
const app = new Koa()

// const IO = require( 'koa-socket' )
// const io = new IO();
// io.attach( app );

// app._io.on( 'connection', socket => {
//   console.log(`新用户建立连接了`);

//   socket.on('join',function(data){
//     socket.emit("history", getData(socket.request.session.id));
//   });
//   // 监听客户端连接
//   socket.on('clientMsg',function(data){
//     switch (data.type) {
//       case 0 :
//         socket.emit('serverMsg', {data:data.message, objectId: data.toId});
//         break;
//       case 1:
//         // app._io.emit('serverMsg','广播消息');
//         break;
//       case 2:
//         app._io.to(groupid).emit('serverMsg',{data:data.message, roomId: data.toRoomId});

//     }
//   })
// });

const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')

const Mongodb = require('./db/connect')

const index = require('./routes/index')

// middlewares
const logger = require('./middlewares/logger')
const session = require('./middlewares/session');

// error handler
onerror(app)

// add mongodb
app.use(async (ctx, next)=>{
  ctx.mongodb = Mongodb;
  await next();
})

// middlewares

// parser
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  encode: "utf-8"
}));
app.use(json())

// logger
app.use(logger);

// session
app.keys = ["SECRET_KEY"];

app.use(session(app))

// routes
app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
