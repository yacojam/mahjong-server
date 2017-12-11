<<<<<<< HEAD
const Router = require('koa-router')
const router = new Router()
const AdmaxDao = require('../db/AdmaxDao')
const tokenManager = require('../redis/tokenRedisDao')
const ErrorType = require('./ServerError')
=======
const Router = require("koa-router");
const router = new Router();
const AdmaxDao = require("../db/AdmaxDao");
const UserDao = require("../db/UserDao");
const tokenManager = require("../redis/tokenRedisDao");
const ErrorType = require("./ServerError");
>>>>>>> origin/master

function checkToken() {
  return async (ctx, next) => {
    const routeName = ctx.path.substring(
      ctx.path.lastIndexOf('/'),
      ctx.path.length
    )
    if (routeName.startsWith('/login')) {
      return next()
    }

    const userid = ctx.cookies.get('userid')
    const token = ctx.cookies.get('token')

    let isValid = await tokenManager.isAccountValid('admxa_' + userid, token)
    if (isValid) {
      return next()
    } else {
      ctx.error = ErrorType.AccountValidError
    }
  }
}

router.use(checkToken())

router.post('/login', async (ctx, next) => {
  try {
    const { username, passwd } = ctx.request.body
    let user = await AdmaxDao.getUser(username, passwd)
    let token = tokenManager.generateToken('admxa_' + user.userid)

    ctx.cookies.set('token', token)
    ctx.cookies.set('userid', user.userid)
    ctx.cookies.set('username', user.username)
    ctx.json = Object.assign({}, user, { token })
  } catch (e) {
    ctx.error = {
      code: ErrorType.AccountError,
      message: e.message || e.toString
    }
  }
})

router.get('/quick_login', async (ctx, next) => {
  const userid = ctx.cookies.get('userid')
  const userData = await AdmaxDao.getUserById(userid)
  ctx.json = userData
})

router.get('/logout', async (ctx, next) => {
  ctx.cookies.set('token', null)
  ctx.cookies.set('userid', null)

  ctx.json = true
})

//获取所有版本配置
router.get('/get_versions', async (ctx, next) => {
  const configs = await AdmaxDao.getAllConfigs()
  ctx.json = configs
})

router.post('/update_version', async (ctx, next) => {
  const cfg = ctx.request.body.config
  const newConfig = await AdmaxDao.updateOrCreateConfig(cfg)
  ctx.json = newConfig
})

router.post('/new_version', async (ctx, next) => {
  const cfg = ctx.request.body.config
  const newVersion = await AdmaxDao.updateOrCreateConfig(cfg)
  ctx.json = newVersion
})

router.post('/delete_version', async (ctx, next) => {
  const vcode = ctx.request.body.versionCode
  await AdmaxDao.deleteConfig(vcode)
  ctx.json = true
})

router.get('/get_users', async (ctx, next) => {
  const pageSize = 20
  const {keyword, pageIndex} = ctx.request.body
  const users = await UserDao.getUsersList(keyword)
  ctx.json = users
})

router.post("/change_card_by", async (ctx, next) => {
  const {userid, number} = ctx.request.body;
  await UserDao.addCardNum(userid, number);
  ctx.json = true;
})

module.exports = router;
