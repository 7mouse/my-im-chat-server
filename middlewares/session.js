// const session = require('koa-generic-session');
// const redisStore = require('koa-redis');
const session = require('koa-session');

const {SECRET_KEY, REDIS_PORT} = require('../config/env');

module.exports = (app) => {
  return session(
  {
    key: "koa:sess",
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    rolling: true
    // store: redisStore({
    //   all: REDIS_PORT
    // })
  }
  , app);
};