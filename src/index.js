import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { setVariables, checkVariables } from './variables.js'
import { setActions } from './actions.js'
import { setFeedbacks } from './feedbacks.js'
import { setPresets } from './presets.js'
import { api } from './api.js'
import crypto from 'crypto'

// ########################
// #### Instance setup ####
// ########################
class MagewellProConvertDecoderInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.pollID = null
	}

	// Cleanup when the module gets deleted or disabled.
	async destroy() {
		this.disablePolling()
		this.controller.abort()
		this.clearSession()
		this.updateStatus(InstanceStatus.Disconnected)
	}

	// Initalize module
	async init(config) {
		this.config = config

		this.STATUS = {
			summaryInfo: {
				device: {
					name: null,
					model: null,
					productId: null,
					//authType: null,
					serialNo: null,
					hwRevision: null,
					fwVersion: null,
					//upToDate: null,
					outputState: null,
					cpuUsage: null,
					memoryUsage: null,
					coreTemp: null,
					boardId: null,
					upTime: null,
					//sdSize: null,
				},
				ethernet: {
					state: null,
					macAddr: null,
					//ipAddr: null,
					//ipMask: null,
					//gwAddr: null,
					//dnsAddr: null,
					txSpeedKbps: null,
					rxSpeedKbps: null,
				},
				rndis: {
					//state: null,
					//ipAddr: null,
					//txSpeedKbps: null,
					//rxSpeedKbps: null,
				},
				source: {
					name: null,
					url: null,
					connected: null,
					tallyPreview: null,
					tallyProgram: null,
					audioDropSamples: null,
					videoDropFrames: null,
					videoBitRate: null,
					audioBitRate: null,
					audioJitter: null,
					videoJitter: null,
					videoWidth: null,
					videoHeight: null,
					videoScan: null,
					videoFieldRate: null,
					audioNumChannels: null,
					audioSampleRate: null,
					audioBitCount: null,
				},
			},
			videoConfig: {
				showTitle: null,
				showTally: null,
				showVUMeter: null,
				vuMeterMode: null,
				showCenterCross: null,
				followInputMode: null,
				safeAreaMode: null,
				identMode: null,
				identText: null,
				hFlip: null,
				vFlip: null,
				switchMode: null,
				deinterlaceMode: null,
				arConvertMode: null,
				inAutoColorFmt: null,
				inColorFmt: null,
				//clipLeft: null,
				//clipTop: null,
				//clipRight: null,
				//clipBottom: null,
			},
			audioConfig: {
				checkPts: null,
				gain: null,
				sampleRate: null,
				channels: null,
				//bitCount: null,
				convertMode: null,
				//ch0: null,
				//ch1: null,
				//ch2: null,
				//ch3: null,
				//ch4: null,
				//ch5: null,
				//ch6: null,
				//ch7: null,
				//ch8: null,
				//ch9: null,
				//ch10: null,
				//ch11: null,
				//ch12: null,
				//ch13: null,
				//ch14: null,
				//ch15: null,
			},
		}

		this.emptyList = () => {
			return [{ id: '', label: 'None' }]
		}

		this.SOURCE_PRESETS = this.emptyList()
		this.NDI_SOURCES = this.emptyList()

		this.session = null

		this.init_variables()
		this.init_actions()
		this.init_feedbacks()
		this.init_presets()

		this.checkVariables()

		this.controller = new AbortController()

		this.pullData()
	}

	// Update module after a config change
	async configUpdated(config) {
		this.disablePolling()
		this.controller.abort()
		this.clearSession()
		this.updateStatus(InstanceStatus.Disconnected, 'Config changed')

		this.init(config)
	}

	enablePolling() {
		clearInterval(this.pollID)
		this.pollID = setInterval(() => this.pullData(), this.config.pollingrate)
		this.log('debug', 'Polling enabled with ' + this.config.pollingrate + 'ms interval')
	}

	disablePolling() {
		clearInterval(this.pollID)
		this.pollID = null
		this.log('debug', 'Polling disabled')
	}

	setupSession(id) {
		if (id !== null && id !== this.session) {
			this.log('debug', 'New session: ' + id)
			this.session = id
		}
	}

	clearSession() {
		if (this.session !== null) {
			this.log('debug', 'Session destroyed: ' + this.session)
			this.session = null
		}
	}

	async checkSession() {
		if (this.session === null) {
			this.session = await this.login()
		}
		return this.session
	}

	getLabel(values, key) {
		return values.find((v) => v.id === key)?.label
	}

	async login() {
		this.log('debug', 'login()')

		this.disablePolling()
		this.clearSession()

		this.updateStatus(InstanceStatus.Connecting, 'Connecting to ' + this.config.host)

		let setCookie = undefined

		const url =
			`http://${this.config.host}/mwapi?method=login&id=${this.config.username}&pass=` +
			crypto.createHash('md5').update(this.config.password).digest('hex')
		this.log('debug', 'GET ' + url)

		const start = Date.now()

		try {
			const response = await fetch(url, {
				signal: AbortSignal.any([AbortSignal.timeout(10000), this.controller.signal]),
			})
			if (response.ok) {
				setCookie = response.headers.getSetCookie()[0]
				if (this.apiStatusIsSuccess(await response.json())) {
					this.log('debug', `login successful after ${Date.now() - start}ms`)
					this.setupSession(setCookie)
					this.updateStatus(InstanceStatus.Ok, 'Connected to ' + this.config.host)

					return setCookie
				}
			}
		} catch (error) {
			this.log('error', `login attempt failed after ${Date.now() - start}ms`)
			if (error.name === 'TimeoutError') {
				this.updateStatus(InstanceStatus.Disconnected, 'Timeout')
			} else {
				this.updateStatus(InstanceStatus.ConnectionFailure, String(error))
			}
		} finally {
			if (!this.controller.signal.aborted && this.config.polling) this.enablePolling()
		}
	}

	async sendCommand(method, args = '') {
		this.log('debug', 'sendCommand()')

		const session = await this.checkSession()
		if (session !== null) {
			if (args !== '') args = '&' + args

			this.log('debug', 'GET mwapi?method=' + method + args)

			const options = {
				signal: AbortSignal.any([AbortSignal.timeout(10000), this.controller.signal]),
				headers: { cookie: session },
			}

			try {
				await this.getAPI(method + args, options)
				this.log('debug', 'OK')
				this.updateStatus(InstanceStatus.Ok)
			} catch (error) {
				this.log('debug', 'FAILED ' + String(error))
			} finally {
				// force status update
				if (!this.config.polling) this.pullData()
			}
		} else {
			this.log('error', 'Unable to send command. No connection to device.')
		}
	}

	async getAPI(method, options, callback = undefined) {
		const url = `http://` + this.config.host + `/mwapi?method=` + method
		this.log('debug', 'GET ' + url)

		const response = await fetch(url, options)
		if (!response.ok) throw new Error('HTTP error: ' + response.status)

		const data = await response.json()
		if (!this.apiStatusIsSuccess(data)) throw new Error('API operation was rejected')

		if (callback !== undefined) callback.call(this, data)

		return data
	}

	async pullData() {
		this.log('debug', 'pullData()')

		const session = await this.checkSession()

		const params = [
			{ method: `get-summary-info`, callback: this.get_summary_info },
			{ method: `get-video-config`, callback: this.get_video_config },
			{ method: `get-audio-config`, callback: this.get_audio_config },
			{ method: `list-channels`, callback: this.list_channels },
			{ method: `get-ndi-sources`, callback: this.get_ndi_sources },
		]

		const c = new AbortController()
		const t = AbortSignal.timeout(this.config.pollingrate - 100)

		const options = {
			signal: AbortSignal.any([t, c.signal, this.controller.signal]),
			headers: { cookie: session },
		}

		const requests = params.map((param) => this.getAPI(param.method, options, param.callback))

		const start = Date.now()
		try {
			await Promise.all(requests)
			this.log('debug', `...all done after ${Date.now() - start}ms`)

			this.checkVariables()
			this.checkFeedbacks()
		} catch (error) {
			c.abort() // cancel any OTHER pending request

			this.log('error', String(error))
			this.log('debug', `...errored after ${Date.now() - start}ms`)

			this.clearSession()
		}
	}

	apiStatusIsSuccess(data) {
		if (typeof data === 'undefined' || typeof data.status === 'undefined') {
			this.updateStatus(InstanceStatus.UnknownError, 'Invalid API response from device')
			return false
		}

		switch (data.status) {
			case api.MW_STATUS_SUCCESS:
				//this.updateStatus(InstanceStatus.Ok)
				return true //continue
			case api.MW_STATUS_AUTH_FAILED:
				this.log('error', 'Authentication failed')
				this.updateStatus(InstanceStatus.AuthenticationFailure)
				break
			case api.MW_STATUS_NOT_LOGGED_IN:
				this.log('debug', 'Login required')
				break
			default: {
				const statusLabel = this.getLabel(api.STATUS_CODES, data.status)
				this.updateStatus(InstanceStatus.UnknownWarning, 'Unexpected status code: ' + statusLabel)
			}
		}

		return false
	}

	get_summary_info(data) {
		this.STATUS.summaryInfo.device.name = data.device['name']
		this.STATUS.summaryInfo.device.model = data.device['model']
		this.STATUS.summaryInfo.device.productId = data.device['product-id']
		this.STATUS.summaryInfo.device.serialNo = data.device['serial-no']
		this.STATUS.summaryInfo.device.hwRevision = data.device['hw-revision']
		this.STATUS.summaryInfo.device.fwVersion = data.device['fw-version']
		this.STATUS.summaryInfo.device.outputState = data.device['output-state']
		this.STATUS.summaryInfo.device.cpuUsage = data.device['cpu-usage']
		this.STATUS.summaryInfo.device.memoryUsage = data.device['memory-usage']
		this.STATUS.summaryInfo.device.coreTemp = data.device['core-temp']
		this.STATUS.summaryInfo.device.boardId = data.device['board-id']
		this.STATUS.summaryInfo.device.upTime = data.device['up-time']

		this.STATUS.summaryInfo.ethernet.state = data.ethernet['state']
		this.STATUS.summaryInfo.ethernet.macAddr = data.ethernet['mac-addr']
		this.STATUS.summaryInfo.ethernet.txSpeedKbps = data.ethernet['tx-speed-kbps']
		this.STATUS.summaryInfo.ethernet.rxSpeedKbps = data.ethernet['rx-speed-kbps']

		this.STATUS.summaryInfo.source.name = data.ndi['name']
		this.STATUS.summaryInfo.source.url = data.ndi['url']
		this.STATUS.summaryInfo.source.connected = data.ndi['connected']
		this.STATUS.summaryInfo.source.tallyPreview = data.ndi['tally-preview']
		this.STATUS.summaryInfo.source.tallyProgram = data.ndi['tally-program']
		this.STATUS.summaryInfo.source.audioDropSamples = data.ndi['audio-drop-frames']
		this.STATUS.summaryInfo.source.videoDropFrames = data.ndi['video-drop-frames']
		this.STATUS.summaryInfo.source.videoBitRate = data.ndi['video-bit-rate']
		this.STATUS.summaryInfo.source.audioBitRate = data.ndi['audio-bit-rate']
		this.STATUS.summaryInfo.source.audioJitter = data.ndi['audio-jitter']
		this.STATUS.summaryInfo.source.videoJitter = data.ndi['video-jitter']
		this.STATUS.summaryInfo.source.videoWidth = data.ndi['video-width']
		this.STATUS.summaryInfo.source.videoHeight = data.ndi['video-height']
		this.STATUS.summaryInfo.source.videoScan = data.ndi['video-scan']
		this.STATUS.summaryInfo.source.videoFieldRate = data.ndi['video-field-rate']
		this.STATUS.summaryInfo.source.audioNumChannels = data.ndi['audio-num-channels']
		this.STATUS.summaryInfo.source.audioSampleRate = data.ndi['audio-sample-rate']
		this.STATUS.summaryInfo.source.audioBitCount = data.ndi['audio-bit-count']
	}

	get_video_config(data) {
		this.STATUS.videoConfig.showTitle = data['show-title']
		this.STATUS.videoConfig.showTally = data['show-tally']
		this.STATUS.videoConfig.showVUMeter = data['show-vu-meter']
		this.STATUS.videoConfig.vuMeterMode = data['vu-meter-mode']
		this.STATUS.videoConfig.showCenterCross = data['show-center-cross']
		this.STATUS.videoConfig.followInputMode = data['follow-input-mode']
		this.STATUS.videoConfig.safeAreaMode = data['safe-area-mode']
		this.STATUS.videoConfig.identMode = data['ident-mode']
		this.STATUS.videoConfig.identText = data['ident-text']
		this.STATUS.videoConfig.hFlip = data['h-flip']
		this.STATUS.videoConfig.vFlip = data['v-flip']
		this.STATUS.videoConfig.switchMode = data['switch-mode']
		this.STATUS.videoConfig.deinterlaceMode = data['deinterlace-mode']
		this.STATUS.videoConfig.arConvertMode = data['ar-convert-mode']
		this.STATUS.videoConfig.inAutoColorFmt = data['in-auto-color-fmt']
		this.STATUS.videoConfig.inColorFmt = data['in-color-fmt']
	}

	get_audio_config(data) {
		this.STATUS.audioConfig.checkPts = data['check-pts']
		this.STATUS.audioConfig.gain = data['gain']
		this.STATUS.audioConfig.sampleRate = data['sample-rate']
		this.STATUS.audioConfig.channels = data['channels']
		this.STATUS.audioConfig.convertMode = data['convert-mode']
	}

	list_channels(data) {
		const c = this.emptyList().concat(data.channels.map((channel) => ({ id: channel['name'], label: channel['name'] })))
		if (
			this.SOURCE_PRESETS.length !== c.length ||
			!this.SOURCE_PRESETS.every((channel, index) => channel.id === c[index].id && channel.label === c[index].label)
		) {
			this.log('debug', 'Source presets updated')
			this.SOURCE_PRESETS = c
			this.init_variables()
			this.init_actions()
			this.init_feedbacks()
			this.init_presets()
		}
	}

	get_ndi_sources(data) {
		const c = this.emptyList().concat(
			data.sources.map((source) => ({ id: source['ndi-name'], label: source['ndi-name'] })),
		)
		if (
			this.NDI_SOURCES.length !== c.length ||
			!this.NDI_SOURCES.every((source, index) => source.id === c[index].id && source.label === c[index].label)
		) {
			this.log('debug', 'NDI sources updated')
			this.NDI_SOURCES = c
			this.init_variables()
			this.init_actions()
			this.init_feedbacks()
			this.init_presets()
		}
	}

	// Return config fields for web config
	getConfigFields() {
		return ConfigFields
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
	init_feedbacks() {
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
