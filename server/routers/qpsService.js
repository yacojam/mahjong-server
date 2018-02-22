const tokenManager = require('../redis/tokenRedisDao')
const qpsManager = require('../manager/qpsManager/qpsManager')
const ErrorType = require('./ServerError')
const Router = require('koa-router')
const router = new Router()

router.get('/get_all_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let qpses = await qpsManager.getAllQps(userid)
      let result = []
      if (qpses && qpses.length > 0) {
        result = qpses.map(qps => {
          let { qpsid, qpsname } = qps
          return {
            qpsid: qps.qpsid,
            qpsname: qps.qpsname,
            creator: qps.creator,
            weixin: qps.weixin,
            qpsnotice: qps.qpsnotice,
            rules: qps.rules,
            usernum: qps.users.length
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.get('/can_create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/update_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let { qpsid, qpsname, qpsnotice, rules } = ctx.request.body
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.get('/active_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let { qpsid } = ctx.query
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
          message: '房卡不够'
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/delete_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.get('/get_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.get('/search_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})


router.post('/exit_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/join_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
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
      await qpsManager.joinQpsRequest(userid, qpsid)
      ctx.json = { result: true }
    } catch (e) {
      console.log(e)
      ctx.error = {
        code: -1,
        message: e.message || e.toString
      }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/agree_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let { qpsid, applyuid } = ctx.request.body
      let qps = qpsManager.getQps(qpsid)
      if (qps == null || qps.creator != userid) {
        ctx.error = {
          code: -1,
          message: '参数校验出错'
        }
        return
      }
      if (qps.getUser(applyuid) != null) {
        ctx.error = {
          code: -1,
          message: '他已经在棋牌室中'
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
      await qpsManager.agreeJoinQpsRequest(userid, qpsid)
      ctx.json = { result: true }
    } catch (e) {
      console.log(e)
      ctx.error = {
        code: -1,
        message: e.message || e.toString
      }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

router.post('/reject_qps_request', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let { qpsid, applyuid } = ctx.request.body
      let qps = qpsManager.getQps(qpsid)
      if (qps == null || qps.creator != userid) {
        ctx.error = {
          code: -1,
          message: '参数校验出错'
        }
        return
      }
      await qpsManager.rejectJoinQpsRequest(userid, qpsid)
      ctx.json = { result: true }
    } catch (e) {
      console.log(e)
      ctx.error = {
        code: -1,
        message: e.message || e.toString
      }
    }
  } else {
    ctx.error = ErrorType.AccountValidError
  }
})

module.exports = router
