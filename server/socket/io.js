const cookie = require('cookie')
const IO = require('socket.io')
const io = new IO()
const user2ws = require('../socket/user2ws')
const attach = require('../dataflow/attach')
const dispatch = require('../dataflow/dispatch')
const publish = require('../dataflow/publish')
const iomock = require('../socket/iomock')

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
    user2ws.setUserConnection(uid, socket)
    socket.on('disconnect', reason => {
      console.log(`user ${uid} leave ${reason}`)
      user2ws.setUserConnection(uid, null)
    })
    socket.on('action', async action => {
      try {
        console.log('HANDLE:', action)
        action._uid = uid
        try {
          await attach(action)
          const newData = await dispatch(action)
          await publish(null, newData, action)
        } catch (e) {
          await publish(e, null, action)
        }
      } catch (e) {
        console.log(e)
      }
    })

    // mock multi user
    iomock(socket)
  }
})

module.exports = io
