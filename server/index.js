const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const convert = require('koa-convert')
const middleware = require('./koa/middleware')
const http = require('http')
const io = require('./socket/io')
const redis = require('./redis') // load reids
;(async function() {
  await redis.load()
})()

app.keys = [' some secret hurr']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  signed: true
}

const router = new Router()
router.use('/dynamicjs', require('./routers/contentScript').routes())
router.use('/user', require('./routers/userService').routes())
router.use('/room', require('./routers/roomService').routes())
router.use('*', require('./routers/index').routes())

app
  .use(koaStatic(__dirname + '/../build'))
  .use(middleware)
  .use(session(CONFIG, app))
  .use(async (ctx, next) => {
    // mock user login
    /*
    if (!ctx.session.uid) {
      ctx.session.uid = 'A' + new Date().getTime()
      console.log(`new user ${ctx.session.uid} join`)
    }
    */
    await next()
  })
  .use(bodyParser())
  .use(convert(cors()))
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
server.listen(8080, '0.0.0.0')
io.attach(server)

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error)
})

//test socket
const roomManager = require('./roomManager/roomManager')
roomManager.start().then(() => {
  console.log(roomManager.data)
  let app2 = new Koa()
  let server2 = http.createServer(app2.callback())
  var io2 = require('socket.io')(server2)
  io2.on('connection', socket => {
    console.log('user connected')
    require('./socket/ioroom')(socket)
  })
  server2.listen(9000)
})
