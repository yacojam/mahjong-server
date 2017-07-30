const weixinService = require('../../server/service/weixinService.js')

describe('WeiXinService', function() {
  it('getAccessToken', async () => {
    const code = 'code not exists'
    const rsp = await weixinService.getAccessToken(code)
    console.log(rsp)
  })
})
