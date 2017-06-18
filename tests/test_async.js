function sleep(t) {
  return new Promise(rs => {
    setTimeout(() => {
      rs()
    }, t)
  })
}

async function test() {
  console.log(new Date())
  await Promise.all([sleep(1000), sleep(2000)])

  console.log(new Date())
}

test()
