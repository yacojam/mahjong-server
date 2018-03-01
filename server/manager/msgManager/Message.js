class Message {
    constructor(attrs) {
        this.fromId = attrs.from
        this.toId = attrs.to
        this.title = attrs.title
        this.type = attrs.type
        this.brief = attrs.brief || '点击查看详情'
        this.content = attrs.content
        this.updateTime = attrs.updateTime
        this.state = attrs.state
    }
}

Message.Type = {
    // 发出的加入申请
    qpsApplySend: 1,
    // 收到的加入申请
    qpsApplyReceived: 2
}

Message.ID_SYSTEM = 100000

module.exports = Message