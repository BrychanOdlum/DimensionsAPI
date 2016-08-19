var mysql = require(process.cwd() + '/app/core/data/mysql')
var nodeSession = require(process.cwd() + '/app/models/nodeSession')


exports.initiate = function(req, res, next) {
	var data = {
		Created: false
	}
	res.json(data)
}

exports.verify = function(req, res, next) {
	var data = {
		IsValid: false
	}
	res.json(data)
}
