
const path = require('path');
const fs = require('fs');
const morgan = require('koa-morgan');

const logger = require('koa-logger');
const compose = require('koa-compose');


// app.use(logger())
// const ENV = process.env.NODE_ENV;
// if (ENV !== 'production') {
//   app.use(morgan('dev'));
// } else {
//   const logFileName = path.join(__dirname, 'logs', 'access.log');
//   const writeStream = fs.createWriteStream(logFileName, {
//     flags: 'a'
//   });
//   app.use(morgan('combined', {
//     stream: writeStream
//   }));
// }

const middlewares = [logger()];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(morgan('dev'));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  middlewares.push(morgan('combined', {
    stream: writeStream
  }));
}

middlewares.push(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
});

module.exports = compose(middlewares);