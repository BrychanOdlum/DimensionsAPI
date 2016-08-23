var mysql = require(process.cwd() + '/app/core/data/mysql')


exports.isConnected = function(account, callback) {
	mysql.query('SELECT `connected` FROM `accountsessions` WHERE `account` = ? ORDER BY `id` DESC LIMIT 1', [account], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		if (result.length == 0) {
			callback(false)
			return
		}
		callback(result[0].connected === 1 ? true : false)
	})
}

exports.get = function(account, cid, ip, xuid, node, callback) {

	var timestamp = Math.floor(Date.now() / 1000);

	mysql.query('SELECT `node`, `connected`, `loggedin` FROM `accountsessions` WHERE `account` = ? AND `cid` = ? AND `IP` = ? ORDER BY `id` DESC LIMIT 1', [account, cid, ip], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		if (result.length === 1) {
			if (result[0].node != node) {
				mysql.query('UPDATE `accountsessions` SET `node` = ? WHERE `account` = ? AND `cid` = ? AND `IP` = ? ORDER BY `id` DESC LIMIT 1', [node, account, cid, ip])
			}
			callback({
				Connected: result[0].connected === 1 ? true : false,
				LoggedIn: result[0].loggedin === 1 ? true : false
			})
			return
		}

		mysql.query('INSERT INTO `accountsessions` (`account`, `cid`, `ip`, `xuid`, `timestamp`, `node`) VALUES (?, ?, ?, ?, ?, ?)', [account, cid, ip, xuid, timestamp, node], function(err) {
			if (err) {
				callback(null)
				return
			}
			callback({
				Connected: false,
				LoggedIn: false
			})
		})
	})
}

exports.login = function(account, cid, ip, xuid, callback) {
	mysql.query('UPDATE `accountsessions` SET `loggedin` = 1 WHERE `account` = ? AND `cid` = ? AND `IP` = ? ORDER BY `id` DESC LIMIT 1', [account, cid, ip], function(err) {
		if (err) {
			callback(false)
			return
		}
		callback(true)
	})
}
