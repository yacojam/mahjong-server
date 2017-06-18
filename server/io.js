const cookie = require('cookie')
const IO = require('socket.io')
const io = new IO()
const userManager = require('./userManager')
const dispatch = require('./eventManager')
const publish = require('./publishManager')

io.on('connection', socket => {
  let uid = 0
  try {
    const sess = cookie.parse(socket.request.headers.cookie)['koa:sess']
    const json = JSON.parse(new Buffer(sess, 'base64').toString())
    uid = json.uid
  } catch (e) {
    console.log(e)
  }
  if (!uid) {
    socket.disconnect(true)
  } else {
    console.log(`user ${uid} connect`)
    userManager.setUserConnection(uid, socket)
    socket.on('disconnect', reason => {
      console.log(`user ${uid} leave ${reason}`)
      userManager.setUserConnection(uid, null)
    })
    socket.on('data', async data => {
      if (data.action) {
        const newData = await dispatch(data.action)
        publish(newData, data.action)
      }
    })

    // mock multi user
    socket.on('userjoin', async user => {
      userManager.setUserConnection(user.uid, socket)
    })
  }
})

module.exports = io
