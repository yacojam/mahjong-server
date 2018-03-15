const Router = require('koa-router')
const router = new Router()
const AdmaxDao = require('../db/AdmaxDao')

router.get('/get_game_config', async ctx => {
  const { version } = ctx.headers
  // 根据版本号判断是否开启体验入口
  let cfg = await AdmaxDao.getConfig(version)

  cfg = cfg || {
    tasteEnable: true,
    tasteAccount: '13311111112',
    shareUrl: 'https://yueyiju.club',
    serviceWeixin: 'byhxmj'
  }
  cfg.clientVersion = '1.1.0'
  ctx.json = cfg
})

module.exports = router
