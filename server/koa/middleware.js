module.exports = async function(ctx, next) {
  Object.defineProperty(ctx, 'json', {
    set(json) {
      this.type = 'application/json'
      this.body = JSON.stringify({
        code: 0,
        data: json
      })
    }
  })

  Object.defineProperty(ctx, 'error', {
    set(error) {
      this.type = 'application/json'
      this.body = JSON.stringify({
        code: -1,
        error: typeof error === 'string'
          ? error
          : error.message || error.toString()
      })
    }
  })
  await next()
}
