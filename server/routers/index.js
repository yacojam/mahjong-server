const Router = require('koa-router')
const router = new Router()

router.get('/add', async ctx => {
  ctx.json = {
    add: new Date()
  }
})

router.get('/test', ctx => {
  console.log('in test', new Date())
  Object.keys(ctx.wss).forEach(key => {
    console.log('send message to ', key)
    const ws = ctx.wss[key]
    ws.emit('data', {
      code: 0,
      data: new Date()
    })
  })
})

module.exports = router
