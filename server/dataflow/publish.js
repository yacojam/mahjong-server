const user2ws = require('../socket/user2ws')

async function publish(error, data, action) {
  console.log('PUBLISH', error, data, action)
  const uid = action._uid
  user2ws.sendMessage(uid, {
    error: error ? error.message || error.toString() : null,
    data
  })
}

module.exports = publish
