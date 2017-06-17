const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const middleware = require('./middleware')
const http = require('http')
const IO = require('socket.io')

app.keys = [' some secret hurr']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  signed: true
}

const router = new Router()
router.use('*', require('./routers/index').routes())

app
  .use(koaStatic(__dirname + '/../build'))
  .use(middleware)
  .use(session(CONFIG, app))
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
server.listen(8080)

const io = new IO()
io.attach(server)

// io
let ioId = 0
app.context.wss = {}
io.on('connection', socket => {
  socket.__id = ++ioId
  console.log('io connection ', ioId)
  app.context.wss[socket.__id] = socket
  socket.on('disconnect', () => {
    delete app.context.wss[socket.__id]
  })
})
