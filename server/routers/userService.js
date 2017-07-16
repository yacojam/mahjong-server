//const co = require('co');
const UserDao = require('../db/UserDao')
const RoomDao = require('../db/RoomDao')

const roomManager = require('../roomManager/roomManager')

const cryptoHelper = require('../md5/cryptoHelper')
const redis = require('../redis/redisHelper')

const ErrorType = require('./ServerError')

const Router = require('koa-router')
const router = new Router()

router.post('/login', async (ctx, next) => {
    var account = ctx.request.body.account
    var deviceid = ctx.request.body.deviceid
    var userData = await UserDao.sync_get_account_info(account)
    console.log(userData)
    if (userData == null) {
        //数据库没有该用户，为该手机号码创建账户
        var userid = await UserDao.sync_create_account(account, '', '赌棍', 1, '')
        if (userid > 0) {
            //生成token
            var token = cryptoHelper.md5(userid + deviceid)
            var date = new Date()
            date.setDate(date.getDate() + 60)
            var validStamp = Date.parse(date)
            await redis.set(userid + deviceid + 'token', token)
            await redis.set(userid + deviceid + 'validtime', validStamp)
            var ret = {
                userid: userid,
                account: account,
                wxid: '',
                name: '赌棍',
                sex: 1,
                headimg: '',
                card: 9,
                roomid: 0,
                token: token
            }
            ctx.body = ret
        } else {
            ctx.error = ErrorType.RegisterError
        }
    } else {
        var token = cryptoHelper.md5(userData.userid + deviceid)
        var date = new Date()
        date.setDate(date.getDate() + 60)
        var validStamp = Date.parse(date)
        await redis.set(userData.userid + deviceid + 'token', token)
        await redis.set(userData.userid + deviceid + 'validtime', validStamp)
        var ret = {
            userid: userData.userid,
            account: userData.account,
            wxid: userData.wxid,
            name: userData.name,
            sex: userData.set,
            headimg: userData.headimg,
            card: userData.card,
            roomid: userData.roomid,
            token: token
        }
        //做一层保护，如果当前用户处于某个房间中，判断当前房间是否valid
        if (ret.roomid > 0) {
            var isroomValid = roomManager.isRoomValid(ret.roomid)
            if (!isroomValid) {
                await UserDao.sycn_update_roomid_of_userid('', userData.userid)
                ret.roomid = ''
            }
        }
        console.log(ret)
        ctx.body = ret
    }
})

router.get('/get_account_info', async (ctx, next) => {
    var userid = ctx.query.userid
    var deviceid = ctx.query.deviceid
    var token = ctx.query.token
    var isValid = await redis.isAccountValid(userid, deviceid, token)
    if (isValid) {
        var userData = await UserDao.sync_get_account_info_by_userid(userid)
        if (userData) {
            var ret = {
                userid: userData.userid,
                account: userData.account,
                wxid: userData.wxid,
                name: userData.name,
                sex: userData.set,
                headimg: userData.headimg,
                card: userData.card,
                roomid: userData.roomid,
                token: token
            }
            //做一层保护，如果当前用户处于某个房间中，判断当前房间是否valid
            if (ret.roomid > 0) {
                var isroomValid = roomManager.isRoomValid(ret.roomid)
                if (!isroomValid) {
                    await UserDao.sycn_update_roomid_of_userid(
                        '',
                        userData.userid
                    )
                    ret.roomid = ''
                }
            }
            console.log(ret)
            ctx.body = ret
        } else {
            ctx.error = ErrorType.AccountError
        }
    } else {
        ctx.error = ErrorType.AccountValidError
    }
})

module.exports = router
