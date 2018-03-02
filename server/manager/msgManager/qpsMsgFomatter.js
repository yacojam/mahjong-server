const Message = require('./Message')
const UserDao = require('../../db/UserDao')

function format(qpsApply, userid) {
    const qps = qpsApply.qpsInfo
    const sender = qpsApply.senderInfo

    if (qpsApply.senderid == userid) {
        // 我是申请人
        return new Message({
            from: Message.ID_SYSTEM,
            to: userid,
            title: `已申请加入棋牌室“${qps.qpsname}”`,
            content: `您加入棋牌室${qps.qpsname}(${qps.qpsid})的申请已提交给棋牌室管理员，如果长时间没有处理，您可联系管理员微信${qps.weixin}。`,
            state: qpsApply.state,
            type: Message.Type.qpsApplySend,
            extra: qpsApply,
            updateTime: qpsApply.updatetime
        })
    } else {
        // 我是棋牌室创建人
        return new Message({
            from: qpsApply.senderid,
            to: userid,
            title: `玩家“${qpsApply.sendername}”申请加入您的棋牌室`,
            content: `玩家${qpsApply.sendername}(${qpsApply.senderid}申请加入您的棋牌室${qps.qpsname}，请尽快处理。`,
            type: Message.Type.qpsApplyReceived,
            state: qpsApply.state,
            extra: qpsApply,
            updateTime: qpsApply.updatetime
        })
    }
}

module.exports = {
    format
}