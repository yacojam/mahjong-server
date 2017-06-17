const Router = require('koa-router')
const router = new Router()

router.get('/index.js', ctx => {
  ctx.type = 'application/javascript'
  ctx.body = 'console.log("index.js")'
})

module.exports = router
