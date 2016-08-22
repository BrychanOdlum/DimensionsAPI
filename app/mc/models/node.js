var mysql = require(process.cwd() + '/app/core/data/mysql')
var NodeRSA = require('node-rsa');




exports.get = function(node, key, callback) {
	mysql.query('SELECT `id`, `key`, `ip` FROM `nodes` WHERE `name` = ?', [node], function(err, result, field) {
		if ((err) || (result.length == 0)) {
			callback(null)
			return
		}

		try {
			var key_pub = new NodeRSA();
			var key_pri = new NodeRSA();
			key_pub.importKey(key, 'public');
			key_pri.importKey(result[0].key, 'private');
			var data = {
				node: node,
				ip: result[0].ip,
				timestamp: 1471663718
			};
			var signed = key_pri.sign(data, 'base64')
			var verified = key_pub.verify(data, signed, 'base64', 'base64')
		} catch(err) {
			callback(null)
			return
		}

		if (!verified) {
			callback(null)
		} else {
			callback(result[0].id)
		}

	});
}
