const Router = require('koa-router')
const router = new Router()

router.get('/index.js', async ctx => {
  ctx.type = 'application/javascript'
  console.log(ctx.session)
  ctx.body = `
  window.uid = '${ctx.session.uid || ''}';
  `
})

module.exports = router
