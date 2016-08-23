var nodeSession = require(process.cwd() + '/app/mc/models/nodeSession')

exports.authenticate = function(req, res, next) {
	if (req.route.path === '/mc/node/initiate') {
		next()
	} else {
		if (typeof req.headers['authorization'] === 'undefined') {
			res.json(401, {
				ErrorMessage: "Failed to authenticate"
			})
			res.end()
		} else {
			var token = req.headers['authorization'].substring(6)
			nodeSession.find(token, function(nodeId) {
				if (nodeId === null) {
					res.json(401, {
						ErrorMessage: "Failed to authenticate"
					})
					res.end()
				} else {
					next();
				}
			})
		}
	}
}
