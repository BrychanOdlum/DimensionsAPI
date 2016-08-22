var mysql = require(process.cwd() + '/app/core/data/mysql')
var crypto = require('crypto');



exports.create = function(node, callback) {
	var timestamp = Math.floor(Date.now() / 1000)
	var token = node + "." + crypto.randomBytes(64).toString('hex');
	token = new Buffer(token).toString('base64');
	mysql.query('INSERT INTO `nodesessions` (`node`, `token`, `timestamp`, `lastrequest`) VALUES (?, ?, ?, ?)', [node, token, timestamp, timestamp], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		callback(token)
	})
}

exports.find = function(key, callback) {
	mysql.query('SELECT `id` FROM `nodesessions` WHERE `token` = ? ORDER BY `id` DESC LIMIT 1', [key], function(err, result) {
		if ((err) || result.length !== 1) {
			callback(null)
			return;
		}
		callback(result[0].id)
	})
}
