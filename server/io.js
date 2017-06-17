const cookie = require('cookie')
const IO = require('socket.io')
const io = new IO()
const userManager = require('./userManager')

io.on('connection', socket => {
  console.log(socket.request.headers)
  const sess = cookie.parse(socket.request.headers.cookie)['koa:sess']
  console.log(sess)
})

module.exports = io
