var mysql = require(process.cwd() + '/app/core/data/mysql')
var bcrypt = require('bcrypt')
var session = require(process.cwd() + '/app/mc/models/accountSession')

exports.getId = function(name, callback) {
	mysql.query('SELECT `id`, `registered` FROM `accounts` WHERE `name` = ?', [name], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		if (result.length == 1) {
			callback({
				id: result[0].id,
				registered: result[0].registered === 1 ? true : false
			})
			return
		}

		mysql.query('INSERT INTO `accounts` (`name`) VALUES (?)', [name], function(err, result) {
			if (err) {
				callback(null)
				return
			}
			mysql.query('SELECT `id` FROM `accounts` WHERE `name` = ?', [name], function(err, result) {
				if (err) {
					callback(null)
					return
				}
				callback({
					id: result[0].id,
					registered: false
				})
			})
		})

	})
}

exports.isLoggedIn = function(name, cid, ip, callback) {
	mysql.query('SELECT 1 FROM `accounts` WHERE `name` = ? AND `cid` = ? AND `ip` = ?', [name, cid, ip], function(err, result) {
		if (result.length == 1)
			callback(true)
		callback(false)
	})
}

exports.tryRegister = function(name, cid, ip, xuid, password, callback) {
	mysql.query('SELECT `id`, `registered` FROM `accounts` WHERE `name` = ?', [name], function(err, accResult) {
		if ((err) || (accResult.length === 0)) {
			callback(null);
			return
		}
		if (accResult[0].registered == 1) {
			callback({AlreadyExist: true})
			return
		}
		var hash = bcrypt.hashSync(password, 12)
		mysql.query('UPDATE `accounts` SET `password` = ?, `registered` = 1 WHERE `id` = ?', [hash, accResult[0].id], function(err) {
			if (err) {
				callback(null)
				return
			}
			session.login(accResult[0].id, cid, ip, xuid, function(response) {
				if (!response) {
					callback({
						HasSession: false
					})
					return
				}
				callback(true)
			})
		})
	})
}

exports.tryLogin = function(name, cid, ip, xuid, password, callback) {
	mysql.query('SELECT `id`, `password` FROM `accounts` WHERE `registered` = 1 AND `name` = ?', [name], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		if (result.length != 1) {
			callback({
				CorrectAccount: false
			})
			return
		}
		var isCorrect = bcrypt.compareSync(password, result[0].password)
		if (!isCorrect) {
			callback({
				CorrectPassword: false
			})
			return;
		}
		session.login(result[0].id, cid, ip, xuid, function(response) {
			if (!response) {
				callback({
					HasSession: false
				})
				return
			}
			callback(true)
		})
	})
}

exports.trySetPassword = function(name, oldpassword, newpassword, callback) {
	mysql.query('SELECT `id`, `password` FROM `accounts` WHERE `registered` = 1 AND `name` = ?', [name], function(err, result) {
		if (err) {
			callback(null)
			return
		}
		if (result.length != 1) {
			callback({
				CorrectAccount: false
			})
			return
		}
		var isCorrect = bcrypt.compareSync(oldpassword, result[0].password)
		if (!isCorrect) {
			callback({
				CorrectPassword: false
			})
			return;
		} else {
			var hash = bcrypt.hashSync(newpassword, 12)
			mysql.query('UPDATE `accounts` SET `password` = ? WHERE `id` = ?', [hash, result[0].id], function(err) {
				if (err) {
					callback({
						Unexpected: true
					})
				} else {
					callback(true)
				}
			})
		}
	})
}
