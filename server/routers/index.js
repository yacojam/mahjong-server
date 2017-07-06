const Router = require('koa-router')
const router = new Router()
const redis = require('../redis')

router.get('/add', async ctx => {
  ctx.json = {
    add: new Date()
  }
})

router.post('/setname', ctx => {
  const username = ctx.request.body.username
  if (username) {
    ctx.session.uid = username
  }
  console.log(ctx.session)
  ctx.json = true
})

router.get('/logout', ctx => {
  ctx.session.uid = ''
  ctx.json = true
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

router.get('/createroom', ctx => {
  const roomid = 'Room' + new Date().getTime()
})

router.get('/redis', ctx => {
  ctx.json = redis.getAll()
})

router.get('/rooms', async ctx => {
  const roomids = (await redis.get('rooms')) || []
  console.log(roomids)
  const ps = roomids.map(roomid => {
    return redis.get('ROOM_' + roomid)
  })
  const rooms = await Promise.all(ps)
  ctx.json = rooms
})

module.exports = router
