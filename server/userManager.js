const userConnection = {}
function setUserConnection(uid, connection) {
  // TODO disconnect old connection
  userConnection[uid] = connection
}

function getUserConnection(uid) {
  return userConnection[uid] || null
}

function sendMessage(uid, message) {
  const ws = getUserConnection(uid)
  if (!ws) {
    return false
  }
  ws.emit('data', message)
  return true
}

module.exports = {
  setUserConnection,
  getUserConnection
}
