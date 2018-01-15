const Room = require('../algorithm/room')
const redis = require('../redis')
const user2ws = require('../socket/user2ws')
const dispatch = require('../dataflow/dispatch')
const actionTypes = require('../algorithm/actiontypes')

function bind(socket) {
  socket.on('userjoin', async (user, fn) => {
    console.log('user join', user)
    user2ws.setUserConnection(user.uid, socket)
    fn(user)
  })
  socket.on('createroom', async (players, fn) => {
    const room = Room.create('Room' + new Date().getTime())
    room.players = players
    await redis.set('ROOM_' + room.id, room)
    const rooms = (await redis.get('rooms')) || []
    rooms.push(room.id)
    await redis.set('rooms', rooms)

    console.log('createroom', room)
    fn(room.id)
  })
}

module.exports = bind
