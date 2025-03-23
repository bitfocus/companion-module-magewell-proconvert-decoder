import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { setVariables, checkVariables } from './variables.js'
import got from 'got'
import crypto from 'crypto'

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

	got_options = {
		responseType: 'json',
		timeout: { request: 1000 },
		headers: {
			cookie: undefined,
		},
	}

	// Initalize module
	async init(config) {
		this.config = config
		this.poll = false
		this.updateStatus(InstanceStatus.Disconnected, 'Initializing')

		this.got_options.prefixUrl = `http://` + this.config.host
		this.got_options.timeout.request = this.config.pollingrate

		this.init_login()

		this.init_actions()
		this.init_feedbacks()
		this.init_variables()
		this.init_presets()

		this.checkVariables()
	}

	// Update module after a config change
	async configUpdated(config) {
		this.config = config
		this.poll = false
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.got_options.prefixUrl = `http://` + this.config.host
		this.got_options.timeout.request = this.config.pollingrate

		this.init_login()
	}

	async init_login() {
		if (this.config.host) {
			this.got_options.headers['cookie'] = undefined

			const cmd = `mwapi?method=login&id=${this.config.username}&pass=${crypto.createHash('md5').update(this.config.password).digest('hex')}`
			if (this.config.verbose) {
				this.log('debug', 'Sending: GET ' + cmd)
			}

			this.updateStatus(InstanceStatus.Connecting)

			try {
				const response = await got.get(cmd, this.got_options)
				if (response.body.status == 0) {
					//login successful
					this.updateStatus(InstanceStatus.Ok)

					this.got_options.headers['cookie'] = response.headers['set-cookie']

					this.get_state()

					if (this.config.polling) {
						this.init_polling()
					} else {
						this.get_state(true)
					}

					//try {
					//	clearInterval(this.login_timer)
					//	this.login_timer = setTimeout(this.init_login, 30 * 60 * 1000) //log back in every 30 minutes;
					//} catch (error) {
					//	this.log('info', 'Unable to initialize login timer. Session will time out in 30 minutes.' + error)
					//}
				} else {
					this.handleErrorNumber(response.body.status)
				}
			} catch (err) {
				//clearInterval(this.login_timer)
				this.got_options.headers['cookie'] = undefined
				this.log('error', 'Error while logging in.')
				this.handleError(err)
			}
		}
	}

	init_polling() {
		if (this.config.polling) {
			if (this.config.verbose) {
				this.log('debug', 'Starting Polling: Every ' + this.config.pollingrate + ' ms')
			}
			this.poll = true
			//this.POLLING_INTERVAL = setInterval(this.get_state, parseInt(this.config.pollingrate))
			this.get_state()
		} else {
			this.poll = false
		}
	}

	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	async get_state(once = false) {
		if (this.poll || once) await this.get_summary_info()

		//Video
		if (this.poll || once) await this.get_video_config()
		if (this.poll || once) await this.get_video_mode()

		//Audio
		if (this.poll || once) await this.get_audio_config()

		//Channels and NDI Sources
		if (this.poll || once) await this.list_channels()
		if (this.poll || once) await this.get_ndi_sources()
		if (this.poll || once) await this.get_channel() //gets the currently selected source channel for decoding
		if (this.poll || once) await this.get_ndi_config()
		if (this.poll || once) await this.get_playback_config()

		//Network
		if (this.poll || once) await this.get_eth_status()

		if (!once && this.poll) await this.sleep(this.config.pollingrate)
		else return

		this.get_state() // loop
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
			this.poll = false
		}
	}

	async get_summary_info() {
		const cmd = `mwapi?method=get-summary-info`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				this.log('info', 'Response: ' + JSON.stringify(response.body))
				this.STATUS.summary.name = response.body.device['name']
				this.STATUS.summary.model = response.body.device['model']
				this.STATUS.summary.productId = response.body.device['product-id']
				this.STATUS.summary.authType = response.body.device['auth-type']
				this.STATUS.summary.serialNumber = response.body.device['serial-no']
				this.STATUS.summary.hwRevision = response.body.device['hw-revision']
				this.STATUS.summary.fwVersion = response.body.device['fw-version']
				this.STATUS.summary.uptodate = response.body.device['up-to-date']
				this.STATUS.summary.outputState = response.body.device['output-state']
				this.STATUS.summary.cpuUsage = response.body.device['cpu-usage']
				this.STATUS.summary.memoryUsage = response.body.device['memory-usage']
				this.STATUS.summary.coreTemp = response.body.device['core-temp']
				this.STATUS.summary.boardId = response.body.device['board-id']
				this.STATUS.summary.upTime = response.body.device['up-time']
				this.STATUS.summary.sdSize = response.body.device['sd-size']

				this.STATUS.summary.ndi.name = response.body.ndi['name']
				this.STATUS.summary.ndi.connected = response.body.ndi['connected']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_video_config() {
		const cmd = `mwapi?method=get-video-config`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				//OSD
				this.STATUS.videoConfig.showTitle = response.body['show-title']
				this.STATUS.videoConfig.showTally = response.body['show-tally']
				this.STATUS.videoConfig.showVUMeter = response.body['show-vu-meter']
				this.STATUS.videoConfig.VUMeterMode = response.body['vu-meter-mode']
				this.STATUS.videoConfig.showCenterCross = response.body['show-center-cross']
				this.STATUS.videoConfig.safeAreaMode = response.body['safe-area-mode']
				this.STATUS.videoConfig.identMode = response.body['ident-mode']
				this.STATUS.videoConfig.identText = response.body['ident-text']

				//Process
				this.STATUS.videoConfig.hFlip = response.body['h-flip']
				this.STATUS.videoConfig.vFlip = response.body['v-flip']
				this.STATUS.videoConfig.deinterlaceMode = response.body['deinterlace-mode']
				this.STATUS.videoConfig.arConvertMode = response.body['ar-convert-mode']
				this.STATUS.videoConfig.alphaDispMode = response.body['alpha-disp-mode']

				//Source
				this.STATUS.videoConfig.autoColorFmt = response.body['in-auto-color-fmt']
				this.STATUS.videoConfig.colorFmt = response.body['in-color-fmt']
				this.STATUS.videoConfig.switchMode = response.body['switch-mode']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_video_mode() {
		const cmd = `mwapi?method=get-video-mode`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				//Video Mode
				this.STATUS.videoMode.width = response.body['width']
				this.STATUS.videoMode.height = response.body['height']
				this.STATUS.videoMode.interlaced = response.body['interlaced']
				this.STATUS.videoMode.fieldRate = response.body['field-rate']
				this.STATUS.videoMode.aspectRatio = response.body['aspect-ratio']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_audio_config() {
		const cmd = `mwapi?method=get-audio-config`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				this.STATUS.audioConfig.gain = response.body['gain']
				this.STATUS.audioConfig.sampleRate = response.body['sample-rate']
				this.STATUS.audioConfig.channels = response.body['channels']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async list_channels() {
		const cmd = `mwapi?method=list-channels`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			let old_channels = this.CHOICES_CHANNELS
			this.CHOICES_CHANNELS = []
			if (response.body && response.body.channels && response.body.channels.length) {
				for (let i = 0; i < response.body.channels.length; i++) {
					let channelName = response.body.channels[i]['name']
					let channelObj = { id: channelName, label: channelName }
					this.CHOICES_CHANNELS.push(channelObj)
				}
				if (JSON.stringify(old_channels) !== JSON.stringify(this.CHOICES_CHANNELS)) {
					this.init_actions() //republish list of actions because of new channels
					this.init_feedbacks() //republish list of feedbacks because of new NDI sources
				}
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_ndi_sources() {
		const cmd = `mwapi?method=get-ndi-sources`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body && response.body.sources && response.body.sources.length) {
				let old_ndi_sources = this.CHOICES_NDI_SOURCES

				this.CHOICES_NDI_SOURCES = []

				for (let i = 0; i < response.body.sources.length; i++) {
					let ndiName = response.body.sources[i]['ndi-name']
					let ipAddr = response.body.sources[i]['ip-addr']

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
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_channel() {
		const cmd = `mwapi?method=get-channel`
		try {
			const response = await got.get(cmd, this.got_options)
			if (response.body && response.body.name) {
				this.STATUS.channelConfig.currentChannel = response.body.name
				if (response.body['ndi-name'] == true) {
					this.STATUS.channelConfig.currentChannelNDI = true
				} else {
					this.STATUS.channelConfig.currentChannelNDI = false
				}
			}

			this.checkVariables()
			this.checkFeedbacks()
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_ndi_config() {
		const cmd = `mwapi?method=get-ndi-config`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				this.STATUS.channelConfig.NDIEnableDiscovery = response.body['enable-discovery']
				this.STATUS.channelConfig.NDIDiscoveryServer = response.body['discovery-server']
				this.STATUS.channelConfig.NDISourceName = response.body['source-name']
				this.STATUS.channelConfig.NDIGroupName = response.body['group-name']
				this.STATUS.channelConfig.NDILowBandwidth = response.body['low-bandwidth']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_playback_config() {
		const cmd = `mwapi?method=get-playback-config`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				this.STATUS.channelConfig.bufferDuration = response.body['buffer-duration']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async get_eth_status() {
		const cmd = `mwapi?method=get-eth-status`
		try {
			const response = await got.get(cmd, this.got_options)
			// Success
			if (response.body) {
				this.STATUS.networkConfig.useDHCP = response.body['use-dhcp']
				this.STATUS.networkConfig.deviceName = response.body['device-name']
				this.STATUS.networkConfig.state = response.body['state']
				this.STATUS.networkConfig.mac = response.body['mac-addr']
				this.STATUS.networkConfig.tx = response.body['tx-speed-kbps']
				this.STATUS.networkConfig.rx = response.body['rx-speed-kbps']

				this.checkVariables()
				this.checkFeedbacks()
			}
		} catch (err) {
			this.handleError(err)
		}
	}

	async sendCommand(method, args) {
		if (args !== '') {
			args = '&' + args
		}

		const cmd = `mwapi?method=${method}${args}`

		if (this.config.verbose) {
			this.log('debug', 'Sending: GET ' + cmd)
		}

		try {
			const response = await got.get(cmd, this.got_options)
			if (response.body && response.body.status) {
				if (this.config.verbose) {
					this.log('debug', 'Status Code Received: ' + statusCode)
				}
				this.processStatusCode(response.body.status)
			}
		} catch (err) {
			this.handleError(err)
		}
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
		this.poll = false

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

runEntrypoint(MagewellProConvertDecoderInstance, [])
