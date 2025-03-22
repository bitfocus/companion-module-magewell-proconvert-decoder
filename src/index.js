import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import crypto from 'crypto'

var rest = require('./rest.js')

var debug
var log

// ########################
// #### Instance setup ####
// ########################
class MagewellProConvertDecoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	STATUS_CODES = [
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
		{ number: 41, status: 'MW_STATUS_CONSTRAINT_VIOLATION' },
	]

	login_cookie = null

	POLLING_INTERVAL = null

	STATUS = {
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
				connected: false,
			},
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
			switchMode: 'blank',
		},
		videoMode: {
			width: 1920,
			height: 1080,
			interlaced: false,
			fieldRate: 5000,
			aspectRatio: '16:9',
		},
		audioConfig: {
			gain: 0.0,
			sampleRate: 48000,
			channels: 2,
		},
		channelConfig: {
			currentChannel: '',
			currentChannelNDI: true,
			NDIEnableDiscovery: false,
			NDIDiscoveryServer: '',
			NDISourceName: '',
			NDIGroupName: '',
			NDILowBandwidth: false,
			bufferDuration: 60,
		},
		networkConfig: {
			useDHCP: true,
			deviceName: '',
			state: '',
			mac: '',
			tx: '',
			rx: '',
		},
	}

	CHOICES_ALPHACHANNELDISPLAYMODES = [
		{ id: 'alpha-only', label: 'Alpha Only' },
		{ id: 'alpha-blend-white', label: 'Alpha Blend White' },
		{ id: 'alpha-blend-black', label: 'Alpha Blend Black' },
		{ id: 'alpha-blend-checkerboard', label: 'Alpha Blend Checkboard' },
	]

	CHOICES_NDI_SOURCES = [{ id: -1, label: 'No NDI Sources loaded.' }]

	login_timer = null

	// Initializes the module.
	async init() {
		this.updateStatus(InstanceStatus.Connecting)

		this.init_login()

		this.init_actions()
		this.init_feedbacks()
		this.init_variables()
		this.init_presets()

		this.checkFeedbacks()
		this.checkVariables()
	}

	// Update module after a config change
	async configUpdated(config) {
		this.config = config

		this.updateStatus(InstanceStatus.Connecting)

		this.init_login()

		this.init_actions()
		this.init_feedbacks()
		this.init_variables()
		this.init_presets()

		this.checkFeedbacks()
		this.checkVariables()
	}

	init_login() {
		if (this.config.host) {
			this.login_cookie = null

			let username = this.config.username
			let password = this.config.password

			let password_md5 = crypto.createHash('md5').update(password).digest('hex')

			let cmd = `/mwapi?method=login&id=${username}&pass=${password_md5}`
			if (this.config.verbose) {
				this.log('debug', 'Sending: GET ' + cmd)
			}
			rest.getRest
				.bind(this)(cmd, {})
				.then(function (result) {
					if (result.data.status == 0) {
						//login successful
						this.updateStatus(InstanceStatus.Ok)

						this.login_cookie = result.response['headers']['set-cookie']

						this.get_state()

						if (this.config.polling) {
							this.init_polling()
						}

						try {
							clearInterval(this.login_timer)
							this.login_timer = setTimeout(this.init_login.bind(self), 30 * 60 * 1000) //log back in every 30 minutes;
						} catch (error) {
							this.log('info', 'Unable to initialize login timer. Session will time out in 30 minutes.')
						}
					} else {
						this.handleErrorNumber(result.data.status)
					}
				})
				.catch(function (message) {
					clearInterval(this.login_timer)
					this.login_cookie = null
					this.log('error', 'Error while logging in.')
					this.handleError(message)
				})
		}
	}

	init_polling() {
		if (this.config.polling) {
			if (this.config.verbose) {
				this.log('debug', 'Starting Polling: Every ' + this.config.pollingrate + ' ms')
			}
			this.POLLING_INTERVAL = setInterval(this.get_state.bind(this), parseInt(this.config.pollingrate))
		} else {
			this.stop_polling()
		}
	}

	stop_polling() {
		if (this.config.polling && this.POLLING_INTERVAL) {
			if (this.config.verbose) {
				this.log('debug', 'Stopping Polling.')
			}
		}

		clearInterval(this.POLLING_INTERVAL)
		this.POLLING_INTERVAL = null
	}

	get_state() {
		this.get_summary_info()

		//Video
		this.get_video_config()
		this.get_video_mode()

		//Audio
		this.get_audio_config()

		//Channels and NDI Sources
		this.list_channels()
		this.get_ndi_sources()
		this.get_channel() //gets the currently selected source channel for decoding
		this.get_ndi_config()
		this.get_playback_config()

		//Network
		this.get_eth_status()
	}

	handleErrorNumber(number) {
		let errObj = this.STATUS_CODES.find((stat) => {
			stat.number = number
		})

		if (errObj) {
			this.handleError(errObj.status)
		}
	}

	handleError(err) {
		try {
			let error = err.toString()

			if (error.indexOf('ECONNREFUSED') > -1) {
				error = 'Connection refused. Is this the right IP address?'
			} else if (error.indexOf('ETIMEDOUT') > -1) {
				error = 'Connection timed out. Is the device still online?'
			} else if (error.indexOf('ENETUNREACH') > -1) {
				error = 'Network unreachable. Check your network settings.'
			}

			this.log('error', `Error: ${error}`)
		} catch (error) {
			//error processing the error, just print it to the log
			this.log('error', `Error: ${error}`)
		} finally {
			this.updateStatus(InstanceStatus.ConnectionFailure, String(err))
			this.STATUS.information = 'Error - See Log'
			this.checkVariables()
			this.stop_polling()
		}
	}

	get_summary_info() {
		let cmd = `/mwapi?method=get-summary-info`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					this.STATUS.summary.name = result.data.device['name']
					this.STATUS.summary.model = result.data.device['model']
					this.STATUS.summary.productId = result.data.device['product-id']
					this.STATUS.summary.authType = result.data.device['auth-type']
					this.STATUS.summary.serialNumber = result.data.device['serial-no']
					this.STATUS.summary.hwRevision = result.data.device['hw-revision']
					this.STATUS.summary.fwVersion = result.data.device['fw-version']
					this.STATUS.summary.uptodate = result.data.device['up-to-date']
					this.STATUS.summary.outputState = result.data.device['output-state']
					this.STATUS.summary.cpuUsage = result.data.device['cpu-usage']
					this.STATUS.summary.memoryUsage = result.data.device['memory-usage']
					this.STATUS.summary.coreTemp = result.data.device['core-temp']
					this.STATUS.summary.boardId = result.data.device['board-id']
					this.STATUS.summary.upTime = result.data.device['up-time']
					this.STATUS.summary.sdSize = result.data.device['sd-size']

					this.STATUS.summary.ndi.name = result.data.ndi['name']
					this.STATUS.summary.ndi.connected = result.data.ndi['connected']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_video_config() {
		let cmd = `/mwapi?method=get-video-config`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					//OSD
					this.STATUS.videoConfig.showTitle = result.data['show-title']
					this.STATUS.videoConfig.showTally = result.data['show-tally']
					this.STATUS.videoConfig.showVUMeter = result.data['show-vu-meter']
					this.STATUS.videoConfig.VUMeterMode = result.data['vu-meter-mode']
					this.STATUS.videoConfig.showCenterCross = result.data['show-center-cross']
					this.STATUS.videoConfig.safeAreaMode = result.data['safe-area-mode']
					this.STATUS.videoConfig.identMode = result.data['ident-mode']
					this.STATUS.videoConfig.identText = result.data['ident-text']

					//Process
					this.STATUS.videoConfig.hFlip = result.data['h-flip']
					this.STATUS.videoConfig.vFlip = result.data['v-flip']
					this.STATUS.videoConfig.deinterlaceMode = result.data['deinterlace-mode']
					this.STATUS.videoConfig.arConvertMode = result.data['ar-convert-mode']
					this.STATUS.videoConfig.alphaDispMode = result.data['alpha-disp-mode']

					//Source
					this.STATUS.videoConfig.autoColorFmt = result.data['in-auto-color-fmt']
					this.STATUS.videoConfig.colorFmt = result.data['in-color-fmt']
					this.STATUS.videoConfig.switchMode = result.data['switch-mode']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_video_mode() {
		let cmd = `/mwapi?method=get-video-mode`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					//Video Mode
					this.STATUS.videoMode.width = result.data['width']
					this.STATUS.videoMode.height = result.data['height']
					this.STATUS.videoMode.interlaced = result.data['interlaced']
					this.STATUS.videoMode.fieldRate = result.data['field-rate']
					this.STATUS.videoMode.aspectRatio = result.data['aspect-ratio']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_audio_config() {
		let cmd = `/mwapi?method=get-audio-config`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					this.STATUS.audioConfig.gain = result.data['gain']
					this.STATUS.audioConfig.sampleRate = result.data['sample-rate']
					this.STATUS.audioConfig.channels = result.data['channels']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	list_channels() {
		let cmd = `/mwapi?method=list-channels`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				let old_channels = this.CHOICES_CHANNELS
				this.CHOICES_CHANNELS = []
				if (result.data && result.data.channels && result.data.channels.length) {
					for (let i = 0; i < result.data.channels.length; i++) {
						let channelName = result.data.channels[i]['name']
						let channelObj = { id: channelName, label: channelName }
						this.CHOICES_CHANNELS.push(channelObj)
					}
					if (JSON.stringify(old_channels) !== JSON.stringify(this.CHOICES_CHANNELS)) {
						this.init_actions() //republish list of actions because of new channels
						this.init_feedbacks() //republish list of feedbacks because of new NDI sources
					}
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_ndi_sources() {
		let cmd = `/mwapi?method=get-ndi-sources`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data && result.data.sources && result.data.sources.length) {
					let old_ndi_sources = this.CHOICES_NDI_SOURCES

					this.CHOICES_NDI_SOURCES = []

					for (let i = 0; i < result.data.sources.length; i++) {
						let ndiName = result.data.sources[i]['ndi-name']
						let ipAddr = result.data.sources[i]['ip-addr']

						let ndiSourceObj = { id: ndiName, label: ndiName + ' (' + ipAddr + ')' }
						this.CHOICES_NDI_SOURCES.push(ndiSourceObj)
					}

					if (this.CHOICES_NDI_SOURCES.length == 0) {
						this.CHOICES_NDI_SOURCES.push({ id: -1, label: 'No NDI Sources loaded.' })
					}

					if (JSON.stringify(old_ndi_sources) !== JSON.stringify(this.CHOICES_NDI_SOURCES)) {
						this.init_actions() //republish list of actions because of new NDI sources
						this.init_feedbacks() //republish list of feedbacks because of new NDI sources
					}
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_channel() {
		let cmd = `/mwapi?method=get-channel`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				if (result.data && result.data.name) {
					this.STATUS.channelConfig.currentChannel = result.data.name
					if (result.data['ndi-name'] == true) {
						this.STATUS.channelConfig.currentChannelNDI = true
					} else {
						this.STATUS.channelConfig.currentChannelNDI = false
					}
				}

				this.checkVariables()
				this.checkFeedbacks()
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_ndi_config() {
		let cmd = `/mwapi?method=get-ndi-config`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					this.STATUS.channelConfig.NDIEnableDiscovery = result.data['enable-discovery']
					this.STATUS.channelConfig.NDIDiscoveryServer = result.data['discovery-server']
					this.STATUS.channelConfig.NDISourceName = result.data['source-name']
					this.STATUS.channelConfig.NDIGroupName = result.data['group-name']
					this.STATUS.channelConfig.NDILowBandwidth = result.data['low-bandwidth']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_playback_config() {
		let cmd = `/mwapi?method=get-playback-config`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					this.STATUS.channelConfig.bufferDuration = result.data['buffer-duration']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	get_eth_status() {
		let cmd = `/mwapi?method=get-eth-status`
		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				// Success
				if (result.data) {
					this.STATUS.networkConfig.useDHCP = result.data['use-dhcp']
					this.STATUS.networkConfig.deviceName = result.data['device-name']
					this.STATUS.networkConfig.state = result.data['state']
					this.STATUS.networkConfig.mac = result.data['mac-addr']
					this.STATUS.networkConfig.tx = result.data['tx-speed-kbps']
					this.STATUS.networkConfig.rx = result.data['rx-speed-kbps']

					this.checkVariables()
					this.checkFeedbacks()
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	sendCommand(method, args) {
		if (args !== '') {
			args = '&' + args
		}

		let cmd = `/mwapi?method=${method}${args}`

		if (this.config.verbose) {
			this.log('debug', 'Sending: GET ' + cmd)
		}

		rest.getRest
			.bind(this)(cmd, {})
			.then(function (result) {
				if (result.data && result.data.status) {
					if (this.config.verbose) {
						this.log('debug', 'Status Code Received: ' + statusCode)
					}
					this.processStatusCode(result.data.status)
				}
			})
			.catch(function (message) {
				this.handleError(message)
			})
	}

	processStatusCode(statusCode) {
		if (statusCode == 37) {
			//not logged in
			this.handleError('Error: Not logged into Device. Re-initiating login.')
			this.init_login()
		} else if (statusCode !== 0) {
			let statusObj = this.STATUS_CODES.find(({ number }) => number === statusCode)
			this.handleError(statusObj.status)
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module will control a Magewell Pro Convert Decoder Device.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Device IP / Hostname',
				width: 4,
				// regex: this.REGEX_IP,
			},
			{
				type: 'textinput',
				id: 'username',
				label: 'Username',
				width: 4,
				default: 'Admin',
			},
			{
				type: 'textinput',
				id: 'password',
				label: 'Password',
				width: 4,
				default: 'Admin',
			},
			{
				type: 'static-text',
				id: 'dummy1',
				width: 12,
				label: ' ',
				value: ' ',
			},
			{
				type: 'static-text',
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
			`,
			},
			{
				type: 'checkbox',
				id: 'polling',
				label: 'Enable Polling (necessary for feedbacks and variables)',
				default: true,
				width: 3,
			},
			{
				type: 'number',
				id: 'pollingrate',
				label: 'Polling Rate (in ms)',
				default: 1000,
				min: 1,
				max: 10000,
				width: 3,
				isVisible: (configValues) => configValues.polling === true,
			},
			{
				type: 'checkbox',
				id: 'verbose',
				label: 'Enable Verbose Logging',
				default: false,
			},
		]
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.stop_polling()

		clearInterval(this.login_timer)

		this.debug('destroy')
	}

	// ##########################
	// #### Instance Actions ####
	// ##########################
	init_actions() {
		this.setActionDefinitions(setActions(this))
	}

	// ############################
	// #### Instance Feedbacks ####
	// ############################
	init_feedbacks(system) {
		this.setFeedbackDefinitions(setFeedbacks(this))
	}

	// ############################
	// #### Instance Variables ####
	// ############################
	init_variables() {
		this.setVariableDefinitions(setVariables(this))
	}

	// Update Values
	checkVariables() {
		checkVariables(this)
	}

	// ##########################
	// #### Instance Presets ####
	// ##########################
	init_presets() {
		this.setPresetDefinitions(setPresets(this))
	}
}

runEntrypoint(MagewellProConvertDecoderInstance)
