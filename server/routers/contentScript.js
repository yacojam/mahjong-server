const Router = require('koa-router')
const router = new Router()

router.get('/index.js', ctx => {
  ctx.type = 'application/javascript'
  ctx.body = `const uid = window.uid = '${ctx.session.uid}';`
})

module.exports = router
