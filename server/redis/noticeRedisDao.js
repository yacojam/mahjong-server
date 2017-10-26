const redis = require('./redisHelper')
const notice = 'Notice_Key'

function getNotice() {
	return redis.get(notice)
}

function setNotice(content) {
	redis.set(notice, content)
}

module.exports = { getNotice, setNotice }
