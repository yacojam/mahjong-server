const userManager = require('./userManager')

async function publish(data, action) {
  console.log('PUBLISH', data, action)
  const uid = action._uid
  userManager.sendMessage(uid, data)
}

module.exports = publish
