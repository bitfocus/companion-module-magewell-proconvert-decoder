
/**
 * Performs the REST command, either GET or POST.
 *
 * @param method        Either GET or POST
 * @param cmd           The command to execute
 * @param body          If POST, an object containing the POST's body
 */
function doRest(method, host, cmd, body, cookie) {
	let self = this;
	var url  = 'http://' + host + cmd

	return new Promise(function(resolve, reject) {

		function handleResponse(err, result) {
			if (err === null && typeof result === 'object' && result.response.statusCode === 200) {
				// A successful response
				resolve(result);
			} else {
				// Failure. Reject the promise.
				var message = 'Unknown error';

				if (result !== undefined) {
					if (result.response !== undefined) {
						message = result.response.statusCode + ': ' + result.response.statusMessage;
					} else if (result.error !== undefined) {
						// Get the error message from the object if present.
						message = result.error.code +': ' + result.error.message;
					}
				}

				reject(message);
			}
		}

		let headers = {};

		if (cookie) {
			headers['Cookie'] = cookie;
		}

		let extra_args = {};

		switch(method) {
			case 'POST':
				self.system.emit('rest', url, body, function(err, result) {
						handleResponse(err, result);
					}, headers, extra_args
				);
				break;

			case 'GET':
				self.system.emit('rest_get', url, function(err, result) {
						handleResponse(err, result);
					}, headers, extra_args
				);
				break;

			default:
				throw new Error('Invalid method');

		}

	});
}

module.exports = {
	/**
	 * Retrieves information via GET and returns a Promise.
	 *
	 * @param cmd           The command to execute
	 * @return              A Promise that's resolved after the GET.
	 */
	 getRest: function(cmd, body) {
		let self = this;
		return doRest.bind(self)('GET', self.config.host, cmd, body, self.login_cookie);
	},

	/**
	 * Requests/Retrieves information via POST and returns a Promise.
	 *
	 * @param cmd           The command to execute
	 * @param body          The body of the POST; an object.
	 * @return              A Promise that's resolved after the POST.
	 */
	postRest: function(cmd, body) {
		let self = this;
		return doRest.bind(self)('POST', self.config.host, cmd, body, self.login_cookie);
	}
}