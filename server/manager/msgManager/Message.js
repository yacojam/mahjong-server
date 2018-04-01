class Message {
    constructor(attrs) {
        this.fromId = attrs.fromId || Message.ID_SYSTEM
        this.toId = attrs.toId
        this.title = attrs.title
        this.type = attrs.type || Message.Type.default
        this.content = attrs.content
        this.updateTime = attrs.updateTime
        this.state = attrs.state || 0
        this.dataid = attrs.dataid
    }
}

Message.Type = {
    // 默认
    default: 0,
    // 发出的加入申请
    qpsApplySend: 1,
    // 收到的加入申请
    qpsApplyReceived: 2
}

Message.ID_SYSTEM = 100000

module.exports = Message