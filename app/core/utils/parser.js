exports.parse = function(req, res, next) {
	var json = res.json;
	res.json = function(code, payload, headers) {
		if (code === undefined) {
			code = 200
		}
		if (code.constructor.name !== 'Number') {
			headers = payload
			payload = code
			code = 200
		}

		var errorMsg = payload.ErrorMessage;
		delete payload.ErrorMessage

		var response = {};
		response.Payload = payload;

		if ((typeof errorMsg !== 'undefined') || (code !== 200)) {
			response.Error = {
				Code: code.constructor.name === 'Number' && code != 200 ? code : 500,
				Message: errorMsg
			}
		}


		json.call(this, code, response, headers)
	}
	next()
}
