exports.badRequest = function(req, res) {
	res.status(400)
	res.json({
		error: 'bad request',
		url: req.originalUrl
	})
}

exports.notFound = function(req, res) {
	res.status(404)
	res.json({
		error: 'not found',
		url: req.originalUrl
	})
}
