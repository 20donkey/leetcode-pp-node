const { fail } = require("../utils/request");
//
module.exports = function ({ whitelist }) {
  return async function checkAuth(ctx, next) {
    if (whitelist.includes(ctx.path)) await next();
    else {
      if (ctx?.session?.user) {
        if (ctx.session.user.pay) {
          await next();
        } else {
          ctx.body = fail({
            message: "本页内容需付费才能查看，请和 lucifer 进行联系~",
            code: 93,
          });
          return;
        }
      }
    }
  };
};
