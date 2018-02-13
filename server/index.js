const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const convert = require('koa-convert')
const middleware = require('./koa/middleware')
const http = require('http')
//const io = require('./socket/io')

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
router.use('/hall', require('./routers/hallService').routes())
router.use('/qps', require('./routers/qpsService').routes())
router.use('/admax', require('./routers/admaxService').routes())
router.use('*', require('./routers/index').routes())

app
  .use(koaStatic(__dirname + '/../build'))
  .use(middleware)
  .use(session(CONFIG, app))
  .use(async (ctx, next) => {
    await next()
  })
  .use(bodyParser())
  .use(convert(cors()))
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
server.listen(8082, '0.0.0.0')
//io.attach(server)

process.on('unhandledRejection', error => {
  console.error('unhandledRejection', error)
})

let app2 = new Koa()
let server2 = http.createServer(app2.callback())
var io2 = require('socket.io')(server2)
io2.on('connection', socket => {
  console.log('user connected')
  require('./socket/ioroom')(socket)
})
server2.listen(9000)

let app3 = new Koa()
let server3 = http.createServer(app3.callback())
var io3 = require('socket.io')(server3)
io3.on('connection', socket => {
  console.log('user qps connected')
  require('./socket/ioqps')(socket)
})
server3.listen(9002)

const sharedManager = require('./manager/sharedManager/sharedManager')
sharedManager.start()

require('./manager/qpsManager/qpsManager').start()
