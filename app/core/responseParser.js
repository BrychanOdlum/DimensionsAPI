exports.handleErrors = function(req, res, next) {
	var json = res.json;
	res.json = function(code, body, headers) {
		if ((code !== undefined) && (code.constructor.name !== 'Number')) {
			headers = body;
			body = code;
		}
		if (typeof body.ErrorMessage !== 'undefined')
		body.Error = {
			Code: code.constructor.name === 'Number' ? code : 500,
			Message: body.ErrorMessage
		}
		delete body.ErrorMessage

		json.call(this, code, body, headers)
	}
	next();
}
