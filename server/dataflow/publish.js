const user2ws = require('../socket/user2ws')

async function publish(data, action) {
  console.log('PUBLISH', data, action)
  const uid = action._uid
  user2ws.sendMessage(uid, data)
}

module.exports = publish
