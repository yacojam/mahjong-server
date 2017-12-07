const Router = require("koa-router");
const router = new Router();
const AdmaxDao = require("../db/AdmaxDao");
const tokenManager = require("../redis/tokenRedisDao");
const ErrorType = require("./ServerError");

router.post("/login", async (ctx, next) => {
  try {
    const { username, passwd } = ctx.request.body;
    let user = await AdmaxDao.getUser(username, passwd);
    let token = tokenManager.generateToken(user.userid);

    ctx.json = { ...user, token };
  } catch (e) {
    console.log(e);
    ctx.error = {
      code: ErrorType.AccountError,
      message: e.message || e.toString
    };
  }
});

//获取所有版本配置
router.get("/get_versions", async (ctx, next) => {
  if (checkToken()) {
    const configs = await AdmaxDao.getAllConfigs();
    ctx.json = configs;
  }
});

router.post("/update_version", async (ctx, next) => {
  if (checkToken()) {
    const cfg = ctx.request.body.cfg;
    await AdmaxDao.updateOrCreateConfig(cfg);
    ctx.json = configs;
  }
});

router.post("/new_version", async (ctx, next) => {
  if (checkToken()) {
    const cfg = ctx.request.body.config;
    const newVersion = await AdmaxDao.updateOrCreateConfig(cfg);
    ctx.json = newVersion;
  }
});

async function checkToken(ctx, onPassed) {
    return true
//   const { userid, token } = ctx.headers;
//   let isValid = await tokenManager.isAccountValid(userid, token);
//   if (isValid) {
//   } else {
//     ctx.error = ErrorType.AccountValidError;
//   }
//   return isValid;
}

module.exports = router;
