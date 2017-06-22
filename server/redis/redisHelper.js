const Redis = require('ioredis');

var redis = new Redis({
	port: 6379,
	host: '106.15.206.180',
	password: 'Njnova211'
});

exports = redis;