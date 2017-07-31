const weixinService = require('../../server/service/weixinService.js')

describe('WeiXinService', function() {
  it('getAccessToken', async () => {
    //    const code = 'code not exists'
    const code = '031ZwHY42ywPqK0TEg052HuUY42ZwHYY'
    const rsp = await weixinService.getAccessToken(code)
    console.log(rsp)
  })
})
