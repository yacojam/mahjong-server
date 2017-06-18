const Room = require('./algorithm/room')
const redis = require('./redis')
const userManager = require('./userManager')
const dispatch = require('./eventManager')
const actionTypes = require('./algorithm/actiontypes')

function bind(socket) {
  socket.on('userjoin', async (user, fn) => {
    console.log('user join', user)
    userManager.setUserConnection(user.uid, socket)
    fn(user)
  })
  socket.on('createroom', async fn => {
    const room = Room.create('Room' + new Date().getTime())
    await redis.set(room.id, room)
    const rooms = (await redis.get('rooms')) || []
    rooms.push(room.id)
    await redis.set('rooms', rooms)

    console.log('createroom', room)
    fn(room.id)
  })
}

module.exports = bind
