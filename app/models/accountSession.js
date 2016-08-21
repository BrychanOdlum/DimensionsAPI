var mysql = require(process.cwd() + '/app/core/data/mysql')



exports.create = function(account, cid, ip, xuid, timestamp, node, callback) {
	mysql.query('INSERT INTO `accountsessions` (`account`, `cid`, `ip`, `xuid`, `timestamp`, `node`) VALUES (?, ?, ?, ?, ?, ?)', [account, cid, ip, xuid, timestamp, node], function(err, result) {
		callback("true")
	})
}

exports.find = function(account, cid, ip, callback) {
	mysql.query('SELECT `id` FROM `accountsessions` WHERE `account` = ? AND `cid` = ? AND `ip` = ?', [account, cid, ip], function(err, result) {
		if (result.length == 1)
			callback(true)
		callback(false)
	})
}
