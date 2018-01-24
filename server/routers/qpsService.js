const tokenManager = require('../redis/tokenRedisDao')
const qpsManager = require('../manager/qpsManager/qpsManager')
const Router = require('koa-router')
const router = new Router()

router.get('/can_create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let canCreate = await qpsManager.canCreateQps(userid)
      if (ret == 1) {
        ctx.error = {
          code: -1,
          message: '房卡不够'
        }
        return
      }
      if (ret == 2) {
        ctx.error = {
          code: -1,
          message: '数量达到限制'
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

router.get('/create_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let canCreate = await qpsManager.canCreateQps(userid)
      if (ret != 0) {
        ctx.error = {
          code: -1,
          message: '创建失败'
        }
        return
      }
      let qpsname = ctx.query.qpsname
      let qpsnotice = ctx.query.qpsnotice
      let rules = ctx.query.rules
      if (typeof rules === 'string') {
        rules = JSON.parse(rules)
      }
      let qps = await createQps(userid, qpsname, qpsnotice, rules)
      ctx.json = { qps }
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

router.get('/update_qps', async (ctx, next) => {
  let userid = ctx.header.userid
  let token = ctx.header.token
  let tokenValid = await tokenManager.isAccountValid(userid, token)
  if (tokenValid) {
    try {
      let { qpsid, qpsname, qpsnotice, rules } = ctx.query
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

router.get('/delete_qps', async (ctx, next) => {
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

module.exports = router
