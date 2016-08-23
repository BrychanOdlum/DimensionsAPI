var nodeSession = require(process.cwd() + '/app/mc/models/nodeSession')

exports.authenticate = function(req, res, next) {
	if (req.route.path.substring(1,3).toLowerCase() == "mc") {
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
						req.node = nodeId
						next();
					}
				})
			}
		}
	} else if (req.route.path.substring(1,3).toLowerCase() == "cp") {
		console.log("control panel shit here...")
	} else {
		res.json(401, {
			ErrorMessage: "Failed to authenticate"
		})
		res.end()
	}
}
