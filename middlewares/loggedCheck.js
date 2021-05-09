const { ErrorModel } = require("../utils/resModel");

const loggedCheck = async (ctx, next) => {
  if (!ctx.session.isNew) await next();
  else {
    ctx.status = 403;
    ctx.body = new ErrorModel("未登陆");
  }
}

module.exports = loggedCheck;