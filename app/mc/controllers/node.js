var mysql = require(process.cwd() + '/app/core/data/mysql')
var node = require(process.cwd() + '/app/mc/models/node')
var nodeSession = require(process.cwd() + '/app/mc/models/nodeSession')


exports.initiate = function(req, res, next) {
	var data = {}
	node.get(req.params.node, req.params.key, function(serverId) {
		if (serverId === null) {
			data.ErrorMessage = "Failed to authenticate"
			res.json(data)
			next()
		} else {
			nodeSession.create(serverId, function(token) {
				if (token === null) {
					data.ErrorMessage = "Could not create session"
				} else {
					data.Token = token
				}
				res.json(data)
				next()
			})
		}
	})
}

exports.verify = function(req, res, next) {
	var data = {
		IsValid: false
	}
	res.json(data)
}
