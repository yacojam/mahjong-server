const Koa = require('koa')
const app = new Koa()
const session = require('koa-session')
const Router = require('koa-router')
const koaStatic = require('koa-static')
const bodyParser = require('koa-bodyparser')
const middleware = require('./koa/middleware')
const http = require('http')
const io = require('./socket/io')

app.keys = [' some secret hurr']
const CONFIG = {
  key: 'koa:sess',
  maxAge: 86400000,
  signed: true
}

const router = new Router()
router.use('/dynamicjs', require('./routers/contentScript').routes())
router.use('*', require('./routers/index').routes())

app
  .use(koaStatic(__dirname + '/../build'))
  .use(middleware)
  .use(session(CONFIG, app))
  .use(async (ctx, next) => {
    // mock user login
    if (!ctx.session.uid) {
      ctx.session.uid = 'A' + new Date().getTime()
    }
    await next()
  })
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())

const server = http.createServer(app.callback())
server.listen(8080)
io.attach(server)
