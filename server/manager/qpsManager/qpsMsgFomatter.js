const Message = require('../msgManager/Message')
const UserDao = require('../../db/UserDao')

function format(qpsApply, qps, userid) {
    const sender = qpsApply.senderInfo

    if (qpsApply.senderid == userid) {
        // 我是申请人
        return new Message({
            fromId: Message.ID_SYSTEM,
            toId: userid,
            title: `已申请加入棋牌室“${qps.qpsname}”`,
            content: `您加入棋牌室${qps.qpsname}(${qps.qpsid})的申请已提交给棋牌室管理员，如果长时间没有处理，您可联系管理员微信${qps.weixin}。`,
            state: qpsApply.state,
            type: Message.Type.qpsApplySend,
            dataid: qpsApply.id,
            updateTime: qpsApply.updatetime
        })
    } else {
        // 我是棋牌室创建人
        return new Message({
            fromId: Message.ID_SYSTEM,
            toId: userid,
            title: `玩家“${qpsApply.sendername}”申请加入您的棋牌室`,
            content: `玩家${qpsApply.sendername}(${qpsApply.senderid}申请加入您的棋牌室“${qps.qpsname}”，请尽快处理。`,
            type: Message.Type.qpsApplyReceived,
            state: qpsApply.state,
            dataid: qpsApply.id,
            updateTime: qpsApply.updatetime
        })
    }
}

module.exports = {
    format
}