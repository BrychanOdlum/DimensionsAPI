var mysql = require(process.cwd() + '/app/core/data/mysql')



exports.isConnected = function(name, callback) {
	mysql.query('SELECT * FROM `sessions` WHERE `id` = ')
}

exports.isRegistered = function(name, callback) {
	mysql.query('SELECT `id` FROM `accounts` WHERE `name` = ?', [req.params.name], function(err, result, field) {
		if (result.length == 1)
			return true;
		return false;
	});
}

// TODO: USE SESSION TABLE
exports.isLoggedIn = function(name, cid, ip, callback) {
	mysql.query('SELECT 1 FROM `accounts` WHERE `name` = ? AND `cid` = ? AND `ip` = ?', [name, cid, ip], function(err, result, field) {
		if (result.length == 1)
			return true;
		return false;
	});
}
