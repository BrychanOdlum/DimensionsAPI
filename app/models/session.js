var mysql = require(process.cwd() + '/app/core/data/mysql')



exports.createSession = function(account, cid, ip, xuid, timestamp, node, callback) {
	mysql.query('INSERT INTO `sessions` (`account`, `cid`, `ip`, `xuid`, `timestamp`, `node`) VALUES (?, ?, ?, ?, ?, ?)', [account, cid, ip, xuid, timestamp, node], function(err, result, field) {
		callback("true")
	})
}

exports.findSession = function(account, cid, ip, callback) {
	mysql.query('SELECT `id` FROM `sessions` WHERE `account` = ?, `cid` = ?, `ip` = ?', [account, cid, ip], function(err, result, field) {
		if (result.length == 1)
			callback(true);
		callback(false);
	});
}
