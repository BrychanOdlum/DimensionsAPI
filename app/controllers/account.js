var mysql = require(process.cwd() + '/app/core/data/mysql')
var account = require(process.cwd() + '/app/models/account')
var session = require(process.cwd() + '/app/models/accountSession')


exports.initiate = function(req, res, next) {
	if ((typeof req.params.name === 'undefined') ||
		(typeof req.params.cid === 'undefined') ||
		(typeof req.params.ip === 'undefined')) {
			res.json(400, {
				ErrorMessage: "Not all parameters receieved"
			})
			return
	}
	var xuid = typeof req.params.xuid !== 'undefined' ? req.params.xuid : null
	var data = {
		Connected: false,
		Registered: false,
		LoggedIn: false,
	}
	account.getId(req.params.name, function(accResponse) {
		if (typeof accResponse === 'undefined') {
			res.json({
				ErrorMessage: "Could not get account ID"
			})
			return
		}
		data.Registered = accResponse.registered
		session.isConnected(accResponse.id, function(isConnected) {
			if (typeof isConnected === 'undefined') {
				res.json(500, {
					ErrorMessage: "An error occured trying to find the previous account session"
				})
				return
			}
			data.Connected = isConnected;
			if (isConnected) {
				res.json(data);
				return;
			}
			session.get(accResponse.id, req.params.cid, req.params.ip, xuid, 1, function(sessResponse) {
				if (sessResponse === true) {
					data.LoggedIn = true
				}
				res.json(data);
			})
		})
	})
}


exports.login = function(req, res, next) {
	if ((typeof req.params.name === 'undefined') ||
		(typeof req.params.cid === 'undefined') ||
		(typeof req.params.ip === 'undefined') ||
		(typeof req.params.password === 'undefined')) {
			res.json(400, {
				ErrorMessage: "Not all parameters receieved"
			})
			return
	}
	var xuid = typeof req.params.xuid !== 'undefined' ? req.params.xuid : null
	account.tryLogin(req.params.name, req.params.cid, req.params.ip, xuid, req.params.password, function(isLoggedIn) {
		if (isLoggedIn === true) {
			console.log("is logged in: " + isLoggedIn)
			res.json({});
			return;
		}
		if (isLoggedIn.CorrectAccount === false) {
			res.json({
				ErrorMessage: "This account does not exist in the database"
			})
			return;
		}
		if (isLoggedIn.CorrectPassword === false) {
			res.json({
				ErrorMessage: "You entered an incorrect password"
			})
			return;
		}
		if (isLoggedIn.HasSession === false) {
			res.json({
				ErrorMessage: "We couldn't find your user; please relog."
			})
			return;
		}
		res.json({
			ErrorMessage: "An unexpected error occured"
		})
	})
}


exports.setPassword = function(req, res, next) {
	if ((typeof req.params.name === 'undefined') ||
		(typeof req.params.oldpassword === 'undefined') ||
		(typeof req.params.newpassword === 'undefined')) {
			res.json(400, {
				ErrorMessage: "Not all parameters receieved"
			})
			return
	}
	account.trySetPassword(req.params.name, req.params.oldpassword, req.params.newpassword, function(isChanged) {
		if (isChanged === true) {
			console.log("is logged in: " + isChanged)
			res.json({});
			return
		}
		if (isChanged.CorrectAccount === false) {
			res.json({
				ErrorMessage: "This account does not exist in the database"
			})
			return
		}
		if (isChanged.CorrectPassword === false) {
			res.json({
				ErrorMessage: "You entered an incorrect password"
			})
			return
		}
		if (isChanged.HasSession === false) {
			res.json({
				ErrorMessage: "We couldn't find your user; please relog."
			})
			return
		}
		res.json({
			ErrorMessage: "An unexpected error occured"
		})
	})
}
