function publish(data, action) {
  console.log('PUBLISH', data, action)
  const uid = action.__uid // should use session uid
}

module.exports = publish
