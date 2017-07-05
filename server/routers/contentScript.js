const Router = require('koa-router')
const router = new Router()

router.get('/index.js', ctx => {
  ctx.type = 'application/javascript'
  if (!ctx.session.uid) {
    ctx.session.uid = 'A' + new Date().getTime()
    console.log(`new user ${ctx.session.uid} join`)
  }

  ctx.body = `const uid = window.uid = '${ctx.session.uid}';`
})

module.exports = router
