var mysql = require(process.cwd() + '/app/core/data/mysql')



exports.create = function(node, key, timestamp, lastrequest) {
	mysql.query('INSERT INTO `nodesessions` (`node`, `key`, `timestamp`, `lastrequest`) VALUES (?, ?, ?, ?)', [name, key, timestamp, lastrequest], function(err, result, field) {
		callback("true")
	})
}

exports.find = function(node, key) {
	mysql.query('SELECT `id` FROM `nodesessions` WHERE `node` = ? AND `key` = ?', [node, key], function(err, result, field) {
		if (result.length == 1)
			callback(true);
		callback(false);
	})
}
