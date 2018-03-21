const tokenManager = require('../redis/tokenRedisDao')
const qpsManager = require('../manager/qpsManager/qpsManager')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()

router.use(tokenManager.tokenChecker())

router.get('/get_all_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let qpses = await qpsManager.getAllQps(userid)
    let result = []
    if (qpses && qpses.length > 0) {
      result = qpses.map(qps => {
        return {
          qpsid: qps.qpsid,
          qpsname: qps.qpsname,
          creator: qps.creator,
          weixin: qps.weixin,
          qpsnotice: qps.qpsnotice,
          rules: qps.rules,
          usernum: qps.users.length,
          running: qps.running
        }
      })
    }
    ctx.json = result
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.get('/can_create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let ret = await qpsManager.canCreateQps(userid)
    if (ret == 1) {
      ctx.error = {
        code: -1,
        message: '请确保您的房卡不少于1000张'
      }
      return
    }
    if (ret == 2) {
      ctx.error = {
        code: -1,
        message: '最多只能创建2个俱乐部哦'
      }
      return
    }
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let ret = await qpsManager.canCreateQps(userid)
    if (ret == 1) {
      ctx.error = {
        code: -1,
        message: '请确保您的房卡不少于1000张'
      }
      return
    }
    if (ret == 2) {
      ctx.error = {
        code: -1,
        message: '最多只能创建2个俱乐部哦'
      }
      return
    }
    let qpsname = ctx.request.body.qpsname
    // TODO yyj 重名检测
    if (qpsManager.getQpsByName(qpsname)) {
      ctx.error = {
        code: -1,
        message: '该棋牌室名称已被占用'
      }
      return
    }
    let qpsnotice = ctx.request.body.qpsnotice
    let weixin = ctx.request.body.weixin
    let rules = ctx.request.body.rules
    if (typeof rules === 'string') {
      rules = JSON.parse(rules)
    }
    let qps = await qpsManager.createQps(userid, qpsname, weixin, qpsnotice, rules)
    ctx.json = qps
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/update_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid, qpsname, qpsnotice, rules, weixin } = ctx.request.body
    if (qpsManager.getQpsByName(qpsname)) {
      ctx.error = {
        code: -1,
        message: '该棋牌室名称已被占用'
      }
      return
    }
    let qps = qpsManager.getQps(qpsid)
    if (qps == null || qps.creator != userid) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    let data = {}
    if (qpsname != null) {
      data.qpsname = qpsname
    }
    if (qpsnotice != null) {
      data.qpsnotice = qpsnotice
    }
    if (weixin != null) {
      data.weixin = weixin
    }
    if (rules != null) {
      if (typeof rules === 'string') {
        rules = JSON.parse(rules)
      }
      data.rules = rules
    }
    await qpsManager.updateQps(qpsid, data)
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/active_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid } = ctx.request.body
    let qps = qpsManager.getQps(qpsid)
    if (qps == null || qps.creator != userid) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    let ret = await qpsManager.activeQps(userid, qpsid)
    if (!ret) {
      ctx.error = {
        code: -1,
        message: '房卡不少于300张时才能激活棋牌室哦'
      }
      return
    }
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/delete_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid } = ctx.request.body
    let qps = qpsManager.getQps(qpsid)
    if (qps == null || qps.creator != userid) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    await qpsManager.deleteQps(userid, qpsid)
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.get('/get_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid } = ctx.query
    let qps = qpsManager.getQps(qpsid)
    if (qps == null || qps.getUser(userid) == null) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    ctx.json = qps
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.get('/search_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid } = ctx.query
    let qps = qpsManager.getQps(qpsid)
    if (qps == null) {
      ctx.error = {
        code: -1,
        message: '该棋牌室不存在'
      }
      return
    }

    ctx.json = {
      creator: qps.creator,
      qpsid: qps.qpsid,
      qpsname: qps.qpsname,
      weixin: qps.weixin,
      qpsnotice: qps.qpsnotice,
      rules: qps.rules,
      joined: qps.users.find(user=>user.userid === userid) != undefined,
      usernum: qps.users.length
    }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})


router.post('/exit_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token

  try {
    let { qpsid } = ctx.request.body
    let qps = qpsManager.getQps(qpsid)
    if (qps == null || qps.getUser(userid) == null) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    await qpsManager.exitQps(userid, qpsid)
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/join_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  
  try {
    let { qpsid } = ctx.request.body
    let qps = qpsManager.getQps(qpsid)
    if (qps == null) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    if (qps.getUser(userid) != null) {
      ctx.error = {
        code: -1,
        message: '您已经在棋牌室中'
      }
      return
    }
    if (qps.users.length >= 500) {
      ctx.error = {
        code: -1,
        message: '棋牌室已满'
      }
      return
    }
    const result = await qpsManager.joinQpsRequest(userid, qpsid)
    if (result === -1) {
      ctx.error = {
        code: -1,
        message: '您已经申请过了，请不要重复申请。'
      }
    } else {
        ctx.json = { result: true }
      }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/agree_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  try {
    let { requestid } = ctx.request.body

    const errorCode = await qpsManager.agreeJoinQpsRequest(requestid, userid)
    let message
    if (errorCode === -1) {
        message = '参数校验出错'
    } else if (errorCode === -2) {
        message = '该玩家已加入棋牌室'
    } else if (errorCode === -3) {
        message = '您的棋牌室已满500人，无法继续添加玩家'
    }
    if (errorCode) {
      ctx.error = {
        code: errorCode,
        message
      }
      return 
    }
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

router.post('/reject_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  try {
    let { requestid } = ctx.request.body
    const errorCode = await qpsManager.rejectJoinQpsRequest(requestid, userid)
    if (errorCode) {
      ctx.error = {
        code: -1,
        message: '参数校验出错'
      }
      return
    }
    ctx.json = { result: true }
  } catch (e) {
    console.log(e)
    ctx.error = {
      code: -1,
      message: e.message || e.toString
    }
  }
})

module.exports = router
