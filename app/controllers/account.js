var mysql 		= require(process.cwd() + '/app/core/mysql')
var account 	= require(process.cwd() + '/app/models/account')


exports.accountInitiate = function(req, res, next) {
	mysql.query('SELECT * FROM `accounts` WHERE `name` = ?', [req.params.name], function(err, result, field) {
		var data = {
			Connceted: false,
			Registered: false,
			LoggedIn: false,
		}
		account.isRegistered(req.params.name, function(response) {
			data.Registered = response
			account.isConnected(req.params.name, function(response) {
				data.Connected = response
				if (!data.Registered) {
					res.json(response)
					return;
				}
				account.isLoggedIn(req.params.name, req.params.cid, req.params.ip, function(response) {
					data.LoggedIn = response
					res.json(response)
				})
			})
		})
	})
