function removePai(pais, pai, count = 1) {
  const rets = []
  let cnt = 0
  pais.forEach(p => {
    if (p !== pai || ++cnt > count) {
      rets.push(p)
    }
  })
  return rets
}

module.exports = {
  removePai
}
