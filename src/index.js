// Magewell Pro Convert Decoder

var instance_skel = require('../../../instance_skel');

var actions = require('./actions.js');
var feedbacks = require('./feedbacks.js');
var variables = require('./variables.js');
var presets = require('./presets.js');

var rest = require('./rest.js');

var debug;
var log;

var crypto = require('crypto');

function instance(system, id, config) {
	let self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	return self;
};

instance.prototype.STATUS_CODES = [
	{ number: 0, status: 'MW_STATUS_SUCCESS'},
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

instance.prototype.login_cookie = null;

instance.prototype.POLLING_INTERVAL = null;

instance.prototype.STATUS = {
	information: '',
	summary: {
		name: '',
		model: '',
		productId: '',
		authType: '',
		serialNumber: '',
		hwRevision: '',
		fwVersion: '',
		uptodate: true,
		outputState: '',
		cpuUsage: '',
		memoryUsage: '',
		coreTemp: '',
		boardId: '',
		upTime: '',
		sdSize: '',
		ndi: {
			name: '',
			connected: false
		}
	},
	videoConfig: {
		showTitle: false,
		showTally: false,
		showVUMeter: false,
		VUMeterMode: 'none',
		showCenterCross: false,
		safeAreaMode: 'none',
		identMode: 'none',
		identText: '',

		hFlip: false,
		vFlip: false,
		deinterlaceMode: 'bob',
		arConvertMode: 'full',
		alphaDispMode: 'alpha-blend-checkerboard',

		autoColorFmt: true,
		colorFmt: 'bt.709',
		switchMode: 'blank'		
	},
	videoMode: {
		width: 1920,
		height: 1080,
		interlaced: false,
		fieldRate: 5000,
		aspectRatio: '16:9'
	},
	audioConfig: {
		gain: 0.0,
		sampleRate: 48000,
		channels: 2
	},
	channelConfig: {
		currentChannel: '',
		currentChannelNDI: true,
		NDIEnableDiscovery: false,
		NDIDiscoveryServer: '',
		NDISourceName: '',
		NDIGroupName: '',
		NDILowBandwidth: false,
		bufferDuration: 60
	},
	networkConfig: {
		useDHCP: true,
		deviceName: '',
		state: '',
		mac: '',
		tx: '',
		rx: ''
	}
};

instance.prototype.CHOICES_ALPHACHANNELDISPLAYMODES = [
	{ id: 'alpha-only', label: 'Alpha Only'},
	{ id: 'alpha-blend-white', label: 'Alpha Blend White'},
	{ id: 'alpha-blend-black', label: 'Alpha Blend Black'},
	{ id: 'alpha-blend-checkerboard', label: 'Alpha Blend Checkboard'},
];

instance.prototype.CHOICES_NDI_SOURCES = [
	{ id: -1, label: 'No NDI Sources loaded.'}
]

instance.prototype.login_timer = null;

/**
 * Initializes the module.
 */
instance.prototype.init = function() {
	let self = this;

	self.status('Connecting',self.STATUS_WARNING);

	self.init_login();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkFeedbacks();
	self.checkVariables();
};

/**
 * Config updated by the user.
 */
 instance.prototype.updateConfig = function(config) {
	let self = this;

	self.config = config;

	self.status('Connecting',self.STATUS_WARNING);

	self.init_login();

	self.init_actions();
	self.init_feedbacks();
	self.init_variables();
	self.init_presets();

	self.checkFeedbacks();
	self.checkVariables();
};

instance.prototype.init_login = function() {
	let self = this;

	if (self.config.host) {
		self.login_cookie = null;
		
		let username = self.config.username;
		let password = self.config.password;

		let password_md5 = crypto.createHash('md5').update(password).digest('hex');

		let cmd = `/mwapi?method=login&id=${username}&pass=${password_md5}`;
		if (self.config.verbose) {
			self.log('debug', 'Sending: GET ' + cmd);
		}
		rest.getRest.bind(this)(cmd, {}).then(function(result) {
			if (result.data.status == 0) { //login successful
				self.status(self.STATUS_OK);

				self.login_cookie = result.response['headers']['set-cookie'];

				self.get_state();

				if (self.config.polling) {
					self.init_polling();
				}

				try {
					clearInterval(self.login_timer);
					self.login_timer = setTimeout(self.init_login.bind(self), (30 * 60 * 1000)); //log back in every 30 minutes;
				}
				catch(error) {
					self.log('info', 'Unable to initialize login timer. Session will time out in 30 minutes.');
				}
			}
			else {
				self.handleErrorNumber(result.data.status);
			}			
		})
		.catch(function(message) {
			clearInterval(self.login_timer);
			self.login_cookie = null;
			self.log('error', 'Error while logging in.');
			self.handleError(message);
		});
	}
};

instance.prototype.init_polling = function() {
	let self = this;

	if (self.config.polling) {
		if (self.config.verbose) {
			self.log('debug', 'Starting Polling: Every ' + self.config.pollingrate + ' ms');
		}
		self.POLLING_INTERVAL = setInterval(self.get_state.bind(this), parseInt(self.config.pollingrate));
	}
	else {
		self.stop_polling();
	}
};

instance.prototype.stop_polling = function() {
	let self = this;

	if (self.config.polling && self.POLLING_INTERVAL) {
		if (self.config.verbose) {
			self.log('debug', 'Stopping Polling.');
		}
	}	

	clearInterval(self.POLLING_INTERVAL);
	self.POLLING_INTERVAL = null;
};

instance.prototype.get_state = function() {
	let self = this;

	self.get_summary_info();

	//Video
	self.get_video_config();
	self.get_video_mode();

	//Audio
	self.get_audio_config();

	//Channels and NDI Sources
	self.list_channels();
	self.get_ndi_sources();
	self.get_channel(); //gets the currently selected source channel for decoding
	self.get_ndi_config();
	self.get_playback_config();

	//Network
	self.get_eth_status();
};

instance.prototype.handleErrorNumber = function(number) {
	let self = this;

	let errObj = self.STATUS_CODES.find((stat) => {stat.number = number});

	if (errObj) {
		self.handleError(errObj.status);
	}
};

instance.prototype.handleError = function(err) {
	let self = this;

	try {
		let error = err.toString();

		if (error.indexOf('ECONNREFUSED') > -1) {
			error = 'Connection refused. Is this the right IP address?';
		}
		else if (error.indexOf('ETIMEDOUT') > -1) {
			error = 'Connection timed out. Is the device still online?';
		}
		else if (error.indexOf('ENETUNREACH') > -1) {
			error = 'Network unreachable. Check your network settings.';
		}
		
		self.log('error', `Error: ${error}`);
	}
	catch(error) {
		//error processing the error, just print it to the log
		self.log('error', `Error: ${error}`);
	}
	finally {
		self.status(self.STATUS_ERROR);
		self.STATUS.information = 'Error - See Log';
		self.checkVariables();
		self.stop_polling();
	}
};

instance.prototype.get_summary_info = function() {
	let self = this;

	let cmd = `/mwapi?method=get-summary-info`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			self.STATUS.summary.name = result.data.device['name'];
			self.STATUS.summary.model = result.data.device['model'];
			self.STATUS.summary.productId = result.data.device['product-id'];
			self.STATUS.summary.authType = result.data.device['auth-type'];
			self.STATUS.summary.serialNumber = result.data.device['serial-no'];
			self.STATUS.summary.hwRevision = result.data.device['hw-revision'];
			self.STATUS.summary.fwVersion = result.data.device['fw-version'];
			self.STATUS.summary.uptodate = result.data.device['up-to-date'];
			self.STATUS.summary.outputState = result.data.device['output-state'];
			self.STATUS.summary.cpuUsage = result.data.device['cpu-usage'];
			self.STATUS.summary.memoryUsage = result.data.device['memory-usage'];
			self.STATUS.summary.coreTemp = result.data.device['core-temp'];
			self.STATUS.summary.boardId = result.data.device['board-id'];
			self.STATUS.summary.upTime = result.data.device['up-time'];
			self.STATUS.summary.sdSize = result.data.device['sd-size'];

			self.STATUS.summary.ndi.name = result.data.ndi['name'];
			self.STATUS.summary.ndi.connected = result.data.ndi['connected'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_video_config = function() {
	let self = this;

	let cmd = `/mwapi?method=get-video-config`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			//OSD
			self.STATUS.videoConfig.showTitle = result.data['show-title'];
			self.STATUS.videoConfig.showTally = result.data['show-tally'];
			self.STATUS.videoConfig.showVUMeter = result.data['show-vu-meter'];
			self.STATUS.videoConfig.VUMeterMode = result.data['vu-meter-mode'];
			self.STATUS.videoConfig.showCenterCross = result.data['show-center-cross'];
			self.STATUS.videoConfig.safeAreaMode = result.data['safe-area-mode'];
			self.STATUS.videoConfig.identMode = result.data['ident-mode'];
			self.STATUS.videoConfig.identText = result.data['ident-text'];

			//Process
			self.STATUS.videoConfig.hFlip = result.data['h-flip'];
			self.STATUS.videoConfig.vFlip = result.data['v-flip'];
			self.STATUS.videoConfig.deinterlaceMode = result.data['deinterlace-mode'];
			self.STATUS.videoConfig.arConvertMode = result.data['ar-convert-mode'];
			self.STATUS.videoConfig.alphaDispMode = result.data['alpha-disp-mode'];

			//Source
			self.STATUS.videoConfig.autoColorFmt = result.data['in-auto-color-fmt'];
			self.STATUS.videoConfig.colorFmt = result.data['in-color-fmt'];
			self.STATUS.videoConfig.switchMode = result.data['switch-mode'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_video_mode = function() {
	let self = this;

	let cmd = `/mwapi?method=get-video-mode`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			//Video Mode
			self.STATUS.videoMode.width = result.data['width'];
			self.STATUS.videoMode.height = result.data['height'];
			self.STATUS.videoMode.interlaced = result.data['interlaced'];
			self.STATUS.videoMode.fieldRate = result.data['field-rate'];
			self.STATUS.videoMode.aspectRatio = result.data['aspect-ratio'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_audio_config = function() {
	let self = this;

	let cmd = `/mwapi?method=get-audio-config`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			self.STATUS.audioConfig.gain = result.data['gain'];
			self.STATUS.audioConfig.sampleRate = result.data['sample-rate'];
			self.STATUS.audioConfig.channels = result.data['channels'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.list_channels = function() {
	let self = this;

	let cmd = `/mwapi?method=list-channels`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		let old_channels = self.CHOICES_CHANNELS;
		self.CHOICES_CHANNELS = [];
		if (result.data && result.data.channels && result.data.channels.length) {
			for (let i = 0; i < result.data.channels.length; i++) {
				let channelName = result.data.channels[i]['name'];
				let channelObj = { id: channelName, label: channelName};
				self.CHOICES_CHANNELS.push(channelObj);
			}
			if (JSON.stringify(old_channels) !== JSON.stringify(self.CHOICES_CHANNELS)) {
				self.init_actions(); //republish list of actions because of new channels
				self.init_feedbacks(); //republish list of feedbacks because of new NDI sources
			}
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_ndi_sources = function() {
	let self = this;

	let cmd = `/mwapi?method=get-ndi-sources`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data && result.data.sources && result.data.sources.length) {
			let old_ndi_sources = self.CHOICES_NDI_SOURCES;
			
			self.CHOICES_NDI_SOURCES = [];

			for (let i = 0; i < result.data.sources.length; i++) {
				let ndiName = result.data.sources[i]['ndi-name'];
				let ipAddr = result.data.sources[i]['ip-addr'];
	
				let ndiSourceObj = { id: ndiName, label: ndiName + ' (' + ipAddr + ')'};
				self.CHOICES_NDI_SOURCES.push(ndiSourceObj);
			}

			if (self.CHOICES_NDI_SOURCES.length == 0) {
				self.CHOICES_NDI_SOURCES.push({ id: -1, label: 'No NDI Sources loaded.'});
			}

			if (JSON.stringify(old_ndi_sources) !== JSON.stringify(self.CHOICES_NDI_SOURCES)) {
				self.init_actions(); //republish list of actions because of new NDI sources
				self.init_feedbacks(); //republish list of feedbacks because of new NDI sources
			}
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_channel = function() {
	let self = this;

	let cmd = `/mwapi?method=get-channel`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		if (result.data && result.data.name) {
			self.STATUS.channelConfig.currentChannel = result.data.name;
			if (result.data['ndi-name'] == true) {
				self.STATUS.channelConfig.currentChannelNDI = true;
			}
			else {
				self.STATUS.channelConfig.currentChannelNDI = false;
			}
		}

		self.checkVariables();
		self.checkFeedbacks();
	})
	.catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_ndi_config = function() {
	let self = this;

	let cmd = `/mwapi?method=get-ndi-config`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			self.STATUS.channelConfig.NDIEnableDiscovery = result.data['enable-discovery'];
			self.STATUS.channelConfig.NDIDiscoveryServer = result.data['discovery-server'];
			self.STATUS.channelConfig.NDISourceName = result.data['source-name'];
			self.STATUS.channelConfig.NDIGroupName = result.data['group-name'];
			self.STATUS.channelConfig.NDILowBandwidth = result.data['low-bandwidth'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_playback_config = function() {
	let self = this;

	let cmd = `/mwapi?method=get-playback-config`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			self.STATUS.channelConfig.bufferDuration = result.data['buffer-duration'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.get_eth_status = function() {
	let self = this;

	let cmd = `/mwapi?method=get-eth-status`;
	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		// Success
		if (result.data) {
			self.STATUS.networkConfig.useDHCP = result.data['use-dhcp'];
			self.STATUS.networkConfig.deviceName = result.data['device-name'];
			self.STATUS.networkConfig.state = result.data['state'];
			self.STATUS.networkConfig.mac = result.data['mac-addr'];
			self.STATUS.networkConfig.tx = result.data['tx-speed-kbps'];
			self.STATUS.networkConfig.rx = result.data['rx-speed-kbps'];

			self.checkVariables();
			self.checkFeedbacks();
		}
	}).catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.sendCommand = function(method, args) {
	let self = this;

	if (args !== '') {
		args = '&' + args;
	}

	let cmd = `/mwapi?method=${method}${args}`;

	if (self.config.verbose) {
		self.log('debug', 'Sending: GET ' + cmd);
	}

	rest.getRest.bind(this)(cmd, {}).then(function(result) {
		if (result.data && result.data.status) {
			if (self.config.verbose) {
				self.log('debug', 'Status Code Received: ' + statusCode);
			}
			self.processStatusCode(result.data.status);
		}
	})
	.catch(function(message) {
		self.handleError(message);
	});
};

instance.prototype.processStatusCode = function(statusCode) {
	let self = this;

	if (statusCode == 37) { //not logged in
		self.handleError('Error: Not logged into Device. Re-initiating login.');
		self.init_login();
	}
	else if (statusCode !== 0) {
		let statusObj = self.STATUS_CODES.find( ({ number }) => number === statusCode);
		self.handleError(statusObj.status);
	}	
}

/**
 * Return config fields for web config.
 */
instance.prototype.config_fields = function() {
	let self = this;

	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module will control a Magewell Pro Convert Decoder Device.'
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
			width: 4,
			default: 'Admin'
		},
		{
			type: 'textinput',
			id: 'password',
			label: 'Password',
			width: 4,
			default: 'Admin'
		},
		{
			type: 'text',
			id: 'dummy1',
			width: 12,
			label: ' ',
			value: ' ',
		},
		{
			type: 'text',
			id: 'info2',
			label: 'Polling',
			width: 12,
			value: `
				<div class="alert alert-warning">
					<strong>Please read:</strong>
					<br>
					Enabling polling unlocks these features:
					<br><br>
					<ul>
						<li>Changes made at the device outside of this module</li>
						<li>Currently selected channel, feedbacks, etc.</li>
					</ul>
					Enabling polling will send a request to the Device at a continuous interval.
					<br>
					<strong>This could have an undesired performance effect on your Device, depending on the polling rate.</strong>
					<br>
				</div>
			`
		},
		{
			type: 'checkbox',
			id: 'polling',
			label: 'Enable Polling (necessary for feedbacks and variables)',
			default: true,
			width: 3
		},
		{
			type: 'textinput',
			id: 'pollingrate',
			label: 'Polling Rate (in ms)',
			default: 1000,
			width: 3,
			isVisible: (configValues) => configValues.polling === true,
		},
		{
			type: 'checkbox',
			id: 'verbose',
			label: 'Enable Verbose Logging',
			default: false
		}
	];
};


/**
 * Cleanup when the module gets deleted or disabled.
 */
instance.prototype.destroy = function() {
	let self = this;

	self.stop_polling();

	clearInterval(self.login_timer);

	self.debug("destroy");
};

// ##########################
// #### Instance Actions ####
// ##########################
instance.prototype.init_actions = function (system) {
	this.setActions(actions.setActions.bind(this)());
};

// ############################
// #### Instance Feedbacks ####
// ############################
instance.prototype.init_feedbacks = function (system) {
	this.setFeedbackDefinitions(feedbacks.setFeedbacks.bind(this)());
};

// ############################
// #### Instance Variables ####
// ############################
instance.prototype.init_variables = function () {
	this.setVariableDefinitions(variables.setVariables.bind(this)());
};

// Setup Initial Values
instance.prototype.checkVariables = function () {
	variables.checkVariables.bind(this)();
};

// ##########################
// #### Instance Presets ####
// ##########################
instance.prototype.init_presets = function () {
	this.setPresetDefinitions(presets.setPresets.bind(this)());
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;