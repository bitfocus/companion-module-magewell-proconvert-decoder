// Magewell Pro Convert Decoder

var instance_skel = require('../../instance_skel');
var debug;
var log;

var crypto = require('crypto');

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions();

	return self;
};

instance.prototype.login_cookie = null;
instance.prototype.ndi_sources = [];

instance.prototype.STATUS_CODES = [
	{ number: 0, status: 'MW_STATUS_SUCCESS' },
	{ number: 1, status: 'MW_STATUS_PENDING' },
	{ number: 2, status: 'MW_STATUS_TIMEOUT' },
	{ number: 3, status: 'MW_STATUS_INTERRUPTED' },
	{ number: 4, status: 'MW_STATUS_TRY_AGAIN' },
	{ number: 5, status: 'MW_STATUS_NOT_IMPLEMENT' },
	{ number: 6, status: 'MW_STATUS_UNKNOWN_ERROR' },
	{ number: 7, status: 'MW_STATUS_INVALID_ARG' },
	{ number: 8, status: 'MW_STATUS_NO_MEMORY' },
	{ number: 9, status: 'MW_STATUS_UNSUPPORTED' },
	{ number: 10, status: 'MW_STATUS_FILE_BUSY' },
	{ number: 11, status: 'MW_STATUS_DEVICE_BUSY,' },
	{ number: 12, status: 'MW_STATUS_DEVICE_LOST' },
	{ number: 13, status: 'MW_STATUS_IO_FAILED' },
	{ number: 14, status: 'MW_STATUS_READ_FAILED' },
	{ number: 15, status: 'MW_STATUS_WRITE_FAILED' },
	{ number: 16, status: 'MW_STATUS_NOT_EXIST' },
	{ number: 17, status: 'MW_STATUS_TOO_MANY' },
	{ number: 18, status: 'MW_STATUS_TOO_LARGE' },
	{ number: 19, status: 'MW_STATUS_OVERFLOW' },
	{ number: 20, status: 'MW_STATUS_UNDERFLOW' },
	{ number: 21, status: 'MW_STATUS_FORMAT_ERROR' },
	{ number: 22, status: 'MW_STATUS_FILE_EXISTS' },
	{ number: 23, status: 'MW_STATUS_FILE_TYPE_ERROR' },
	{ number: 24, status: 'MW_STATUS_DEVICE_TYPE_ERROR' },
	{ number: 25, status: 'MW_STATUS_IS_DIRECTORY' },
	{ number: 26, status: 'MW_STATUS_READ_ONLY' },
	{ number: 27, status: 'MW_STATUS_RANGE_ERROR' },
	{ number: 28, status: 'MW_STATUS_BROKEN_PIPE' },
	{ number: 29, status: 'MW_STATUS_NO_SPACE' },
	{ number: 30, status: 'MW_STATUS_NOT_DIRECTORY' },
	{ number: 31, status: 'MW_STATUS_NOT_PERMITTED' },
	{ number: 32, status: 'MW_STATUS_BAD_ADDRESS' },
	{ number: 33, status: 'MW_STATUS_SEEK_ERROR' },
	{ number: 34, status: 'MW_STATUS_CROSS_DEVICE_LINK' },
	{ number: 35, status: 'MW_STATUS_NOT_INITIALIED' },
	{ number: 36, status: 'MW_STATUS_AUTH_FAILED' },
	{ number: 37, status: 'MW_STATUS_NOT_LOGGED_IN' },
	{ number: 38, status: 'MW_STATUS_WRONG_STATE' },
	{ number: 39, status: 'MW_STATUS_MISMATCH' },
	{ number: 40, status: 'MW_STATUS_VERIFY_FAILED' },
	{ number: 41, status: 'MW_STATUS_CONSTRAINT_VIOLATION' }
];

/**
 * Config updated by the user.
 */
instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	self.init_login();
};

/**
 * Initializes the module.
 */
instance.prototype.init = function() {
	var self = this;

	self.status(self.STATE_OK);
	self.init_login();
};

instance.prototype.init_login = function() {
	var self = this;

	if ((self.config.username !== '') && (self.config.password !== '')) {
		//username and password not blank, so initiate login session
		let username = self.config.username;
		let password = self.config.password;

		let password_md5 = crypto.createHash('md5').update(password).digest('hex');

		let cmd = `/mwapi?method=login&id=${username}&pass=${password_md5}`;
		self.getRest(cmd, {}).then(function(result) {
			// Success
			self.login_cookie = result.response['headers']['set-cookie'];
			self.get_ndi_sources();
		}).catch(function(message) {
			self.login_cookie = null;
			self.log('error', self.config.host + ' : ' + message);
		});
	}
};

instance.prototype.get_ndi_sources = function() {
	var self = this;

	let cmd = `/mwapi?method=get-ndi-sources`;
	self.getRest(cmd, {}).then(function(result) {
		// Success
		self.ndi_sources = [];
		for (let i = 0; i < result.data.sources.length; i++) {
			let ndiName = result.data.sources[i]['ndi-name'];
			let ipAddr = result.data.sources[i]['ip-addr'];

			let ndiSourceObj = { id: ndiName, label: ndiName + ' (' + ipAddr + ')'};
			self.ndi_sources.push(ndiSourceObj);
		}
		self.actions(); //republish list of actions because of new NDI sources
	}).catch(function(message) {
		self.login_cookie = null;
		self.log('error', self.config.host + ' : ' + message);
	});
};

instance.prototype.setChannel = function(ndi) {
	var self = this;

	let cmd = `/mwapi?method=set-channel&ndi-name=true&name=${ndi}`;
	self.getRest(cmd, {}).then(function(result) {
		// Success
		self.processStatusCode(result.data.status);
	}).catch(function(message) {
		self.login_cookie = null;
		self.log('error', self.config.host + ' : ' + message);
	});
};

instance.prototype.processStatusCode = function(statusCode) {
	var self = this;

	if (statusCode !== 0) {
		let statusObj = self.STATUS_CODES.find( ({ number }) => number === statusCode);
		self.log('error', self.config.host + ' : ' + statusObj.status);
	}
}

/**
 * Return config fields for web config.
 */
instance.prototype.config_fields = function() {
	var self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will control a Magewell Pro Convert Decoder.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'IP Address',
			width: 4,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'username',
			label: 'Username',
			width: 4
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 4
		}
	];

};


/**
 * Cleanup when the module gets deleted.
 */
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
};


/**
 * Populates the supported actions.
 */
instance.prototype.actions = function(system) {
	var self = this;

	self.setActions({
		'set_channel': {
			label: 'Set NDI Channel',
			options: [
				{
					type: 'dropdown',
					label: 'NDI Source',
					id: 'ndi',
					choices: self.ndi_sources
				}
			]
		},

		'get_ndi_sources': {
			label: 'Get NDI Sources'
		}

	});
};


/**
 * Retrieves information via GET and returns a Promise.
 *
 * @param cmd           The command to execute
 * @return              A Promise that's resolved after the GET.
 */
instance.prototype.getRest = function(cmd, body) {
	var self = this;
	return self.doRest('GET', cmd, body);
};

/**
 * Requests/Retrieves information via POST and returns a Promise.
 *
 * @param cmd           The command to execute
 * @param body          The body of the POST; an object.
 * @return              A Promise that's resolved after the POST.
 */
instance.prototype.postRest = function(cmd, body) {
	var self = this;
	return self.doRest('POST', cmd, body);
};

/**
 * Performs the REST command, either GET or POST.
 *
 * @param method        Either GET or POST
 * @param cmd           The command to execute
 * @param body          If POST, an object containing the POST's body
 */
instance.prototype.doRest = function(method, cmd, body) {
	var self = this;
	var url  = self.makeUrl(cmd);

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

		if (self.login_cookie !== null) {
			headers['Cookie'] = self.login_cookie;
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

};


/**
 * Runs the specified action.
 *
 * @param action
 */
instance.prototype.action = function(action) {
	var self = this;
	var opt = action.options;

	try {
		switch (action.action) {
			case 'set_channel':
				self.setChannel(opt.ndi);
				break;
			case 'get_ndi_sources':
				self.get_ndi_sources();
				break;
		}

	} catch (err) {
		self.log('error', err.message);
	}
};

/**
 * Runs the [POST] command.
 *
 * @param cmd           The command the run. Must start with '/'
 * @param body          The body of the POST content
 */
instance.prototype.doCommand = function(cmd, body) {
	var self = this;
	body = body || {};

	self.postRest(cmd, body).then(function(objJson) {
		// Success
	}).catch(function(message) {
		self.log('error', self.config.host + ' : ' + message);
	});
};

/**
 * Makes the complete URL.
 *
 * @param cmd           Must start with a /
 */
instance.prototype.makeUrl = function(cmd) {
	var self = this;

	if (cmd[0] !== '/') {
		throw new Error('cmd must start with a /');
	}

	return 'http://' + self.config.host + cmd;
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;