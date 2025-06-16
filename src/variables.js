// ##########################
// #### Define Variables ####
// ##########################
export function setVariables(self) {
	const variables = []

	// Summary Info
	variables.push({ variableId: 'deviceName', name: 'Device - Name' })
	variables.push({ variableId: 'deviceModel', name: 'Device - Model' })
	variables.push({ variableId: 'deviceProductId', name: 'Device - Product ID' })
	variables.push({ variableId: 'deviceSerialNo', name: 'Device - Serial number' })
	variables.push({ variableId: 'deviceHwRevision', name: 'Device - Hardware version' })
	variables.push({ variableId: 'deviceFwVersion', name: 'Device - Firmware version' })
	variables.push({ variableId: 'deviceOutputState', name: 'Device - HDMI Output State' })
	variables.push({ variableId: 'deviceCpuUsage', name: 'Device - CPU Usage (%)' })
	variables.push({ variableId: 'deviceMemoryUsage', name: 'Device - Memory Usage (%)' })
	variables.push({ variableId: 'deviceCoreTemp', name: 'Device - Temperature (°C)' })
	variables.push({ variableId: 'deviceBoardId', name: 'Device - Slot index' })
	variables.push({ variableId: 'deviceUpTime', name: 'Device - Up time (s)' })

	variables.push({ variableId: 'ethernetState', name: 'Ethernet - Link State' })
	variables.push({ variableId: 'ethernetTxSpeedKbps', name: 'Ethernet - Send Rate (Kbps)' })
	variables.push({ variableId: 'ethernetRxSpeedKbps', name: 'Ethernet - Receive Rate (Kbps)' })

	variables.push({ variableId: 'sourceName', name: 'Source - Name' })
	variables.push({ variableId: 'sourceUrl', name: 'Source - URL' })
	variables.push({ variableId: 'sourceUrlType', name: 'Source - Type' }) // Custom variable
	variables.push({ variableId: 'sourceBufferDuration', name: 'Source - Buffer Duration (ms)' }) // Custom variable
	variables.push({ variableId: 'sourceBufferUsage', name: 'Source - Buffer Usage (%)' }) // Custom variable
	variables.push({ variableId: 'sourceBufferUsageBar', name: 'Source - Buffer Usage Bar' }) // Custom variable
	variables.push({ variableId: 'sourceConnected', name: 'Source - Connected' })
	variables.push({ variableId: 'sourceTallyPreview', name: 'Source - Tally Preview' })
	variables.push({ variableId: 'sourceTallyProgram', name: 'Source - Tally Program' })
	variables.push({ variableId: 'sourceAudioDropSamples', name: 'Source - Audio Dropped Samples' })
	variables.push({ variableId: 'sourceVideoDropFrames', name: 'Source - Video Dropped Frames' })
	variables.push({ variableId: 'sourceVideoBitrate', name: 'Source - Video Bit Rate (kbps)' })
	variables.push({ variableId: 'sourceAudioBitrate', name: 'Source - Audio Bit Rate (Kbps)' })
	variables.push({ variableId: 'sourceTotalBitrate', name: 'Source - Total Bit Rate (kbps)' }) // Custom variable
	variables.push({ variableId: 'sourceAudioJitter', name: 'Source - Audio Jitter (ms)' })
	variables.push({ variableId: 'sourceVideoJitter', name: 'Source - Video Jitter (ms)' })
	variables.push({ variableId: 'sourceTotalJitter', name: 'Source - Total Jitter (ms)' }) // Custom variable
	variables.push({ variableId: 'sourceVideoWidth', name: 'Source - Video Width' })
	variables.push({ variableId: 'sourceVideoHeight', name: 'Source - Video Height' })
	variables.push({ variableId: 'sourceVideoScan', name: 'Source - Video Scan Mode' })
	variables.push({ variableId: 'sourceVideoScanShort', name: 'Source - Video Scan Mode (Short)' }) // Custom variable
	variables.push({ variableId: 'sourceVideoFieldrate', name: 'Source - Video Field Rate (FPS)' })
	variables.push({ variableId: 'sourceAudioNumChannels', name: 'Source - Audio Number of Channels' })
	variables.push({ variableId: 'sourceAudioSamplerate', name: 'Source - Audio Sample Rate (Hz)' })
	variables.push({ variableId: 'sourceAudioBitCount', name: 'Source - Audio Bit Count' })

	// Video Config
	variables.push({ variableId: 'configVideoShowTitle', name: 'Video Config - OSD - Show source name & resolution' })
	variables.push({ variableId: 'configVideoShowTally', name: 'Video Config - OSD - Show tally indicators' })
	variables.push({ variableId: 'configVideoShowVUMeter', name: 'Video Config - OSD - Show audio meter' })
	variables.push({ variableId: 'configVideoVuMeterMode', name: 'Video Config - OSD - Audio meter scale' })
	variables.push({ variableId: 'configVideoShowCenterCross', name: 'Video Config - OSD - Show center cross' })
	variables.push({ variableId: 'configVideoFollowInputMode', name: 'Video Config - Resolution - Follow input' })
	variables.push({ variableId: 'configVideoSafeAreaMode', name: 'Video Config - OSD - Safe area' })
	variables.push({ variableId: 'configVideoIdentMode', name: 'Video Config - OSD - Ident Mode' })
	variables.push({ variableId: 'configVideoIdentText', name: 'Video Config - OSD - Ident Text' })
	variables.push({ variableId: 'configVideoHFlip', name: 'Video Config - Process - Horizontal flip' })
	variables.push({ variableId: 'configVideoVFlip', name: 'Video Config - Process - Vertical flip' })
	variables.push({ variableId: 'configVideoSwitchMode', name: 'Video Config - Source - Display after source lost' })
	variables.push({ variableId: 'configVideoDeinterlaceMode', name: 'Video Config - Process - Deinterlace mode' })
	variables.push({ variableId: 'configVideoArConvertMode', name: 'Video Config - Process - AR convert' })
	variables.push({ variableId: 'configVideoInAutoColorFmt', name: 'Video Config - Source - Auto color encoding' })
	variables.push({ variableId: 'configVideoInColorFmt', name: 'Video Config - Source - Color encoding' })

	// Audio Config
	variables.push({ variableId: 'configAudioCheckPts', name: 'Audio Config - Check audio PTS' })
	variables.push({ variableId: 'configAudioGain', name: 'Audio Config - Gain (dB)' })
	variables.push({ variableId: 'configAudioSamplerate', name: 'Audio Config - Sample Rate (Hz)' })
	variables.push({ variableId: 'configAudioChannels', name: 'Audio Config - Channel count' })
	variables.push({ variableId: 'configAudioConvertMode', name: 'Audio Config - Convert Mode' })

	// Source Presets
	self.SOURCE_PRESETS.forEach((channel, index) => {
		variables.push({ variableId: `presetSource${index}`, name: `Source Preset #${index}` })
	})

	return variables
}

// #########################
// #### Check Variables ####
// #########################
export function checkVariables(self) {
	const progressBar = (pct, width = 20, start = '', end = '') => {
		if (pct && pct >= 0 && pct <= 100) {
			const flr = Math.floor((pct * width) / 100)
			return start + '|'.repeat(flr).padEnd(width, '.') + end
		}
		return '---'
	}

	const normalizePct = (val, low = 0, high = 100, limit = false, fractionDigits = 0) => {
		if (limit) {
			val = val < low ? low : val
			val = val > high ? high : val
		}
		return val < low || val > high ? null : (((val - low) / (high - low)) * 100).toFixed(fractionDigits)
	}

	const getBufferDuration = (url) => {
		const bufferDuration = url?.match(/mw-buffer-duration=(\d+)/)
		return bufferDuration ? parseInt(bufferDuration[1]) : 0
	}

	const buffer = getBufferDuration(self.STATUS.summaryInfo.source.url)
	const jitter = Math.max(self.STATUS.summaryInfo.source.audioJitter, self.STATUS.summaryInfo.source.videoJitter)
	const bitrate = self.STATUS.summaryInfo.source.videoBitRate + self.STATUS.summaryInfo.source.audioBitRate

	self.setVariableValues({
		deviceName: self.STATUS.summaryInfo.device.name,
		deviceModel: self.STATUS.summaryInfo.device.model,
		deviceProductId: self.STATUS.summaryInfo.device.productId,
		deviceSerialNo: self.STATUS.summaryInfo.device.serialNo,
		deviceHwRevision: self.STATUS.summaryInfo.device.hwRevision,
		deviceFwVersion: self.STATUS.summaryInfo.device.fwVersion,
		deviceOutputState: self.STATUS.summaryInfo.device.outputState,
		deviceCpuUsage: self.STATUS.summaryInfo.device.cpuUsage?.toFixed(2),
		deviceMemoryUsage: self.STATUS.summaryInfo.device.memoryUsage?.toFixed(2),
		deviceCoreTemp: self.STATUS.summaryInfo.device.coreTemp?.toFixed(2),
		deviceBoardId: self.STATUS.summaryInfo.device.boardId,
		deviceUpTime: self.STATUS.summaryInfo.device.upTime,

		ethernetState: self.STATUS.summaryInfo.ethernet.state,
		ethernetTxSpeedKbps: self.STATUS.summaryInfo.ethernet.txSpeedKbps,
		ethernetRxSpeedKbps: self.STATUS.summaryInfo.ethernet.rxSpeedKbps,

		sourceName: self.STATUS.summaryInfo.source.name,
		sourceUrl: self.STATUS.summaryInfo.source.url,
		sourceConnected: self.STATUS.summaryInfo.source.connected,
		sourceTallyPreview: self.STATUS.summaryInfo.source.tallyPreview,
		sourceTallyProgram: self.STATUS.summaryInfo.source.tallyProgram,
		sourceAudioDropSamples: self.STATUS.summaryInfo.source.audioDropSamples,
		sourceVideoDropFrames: self.STATUS.summaryInfo.source.videoDropFrames,
		sourceVideoBitrate: self.STATUS.summaryInfo.source.videoBitRate,
		sourceAudioBitrate: self.STATUS.summaryInfo.source.audioBitRate,
		sourceAudioJitter: self.STATUS.summaryInfo.source.audioJitter,
		sourceVideoJitter: self.STATUS.summaryInfo.source.videoJitter,
		sourceVideoWidth: self.STATUS.summaryInfo.source.videoWidth,
		sourceVideoHeight: self.STATUS.summaryInfo.source.videoHeight,
		sourceVideoScan: self.STATUS.summaryInfo.source.videoScan,
		sourceVideoFieldrate: self.STATUS.summaryInfo.source.videoFieldRate,
		sourceAudioNumChannels: self.STATUS.summaryInfo.source.audioNumChannels,
		sourceAudioSamplerate: self.STATUS.summaryInfo.source.audioSampleRate,
		sourceAudioBitCount: self.STATUS.summaryInfo.source.audioBitCount,

		configVideoShowTitle: self.STATUS.videoConfig.showTitle,
		configVideoShowTally: self.STATUS.videoConfig.showTally,
		configVideoShowVUMeter: self.STATUS.videoConfig.showVUMeter,
		configVideoVuMeterMode: self.STATUS.videoConfig.vuMeterMode,
		configVideoShowCenterCross: self.STATUS.videoConfig.showCenterCross,
		configVideoFollowInputMode: self.STATUS.videoConfig.followInputMode,
		configVideoSafeAreaMode: self.STATUS.videoConfig.safeAreaMode,
		configVideoIdentMode: self.STATUS.videoConfig.identMode,
		configVideoIdentText: self.STATUS.videoConfig.identText,
		configVideoHFlip: self.STATUS.videoConfig.hFlip,
		configVideoVFlip: self.STATUS.videoConfig.vFlip,
		configVideoSwitchMode: self.STATUS.videoConfig.switchMode,
		configVideoDeinterlaceMode: self.STATUS.videoConfig.deinterlaceMode,
		configVideoArConvertMode: self.STATUS.videoConfig.arConvertMode,
		configVideoInAutoColorFmt: self.STATUS.videoConfig.inAutoColorFmt,
		configVideoInColorFmt: self.STATUS.videoConfig.inColorFmt,

		configAudioCheckPts: self.STATUS.audioConfig.checkPts,
		configAudioGain: self.STATUS.audioConfig.gain,
		configAudioSamplerate: self.STATUS.audioConfig.sampleRate,
		configAudioChannels: self.STATUS.audioConfig.channels,
		configAudioConvertMode: self.STATUS.audioConfig.convertMode,

		// Custom variables
		sourceUrlType: (self.STATUS.summaryInfo.source.url?.split(':')[0] ?? '').toUpperCase(),
		sourceVideoScanShort: self.STATUS.summaryInfo.source.videoScan?.charAt(0) ?? ' ',

		sourceBufferDuration: buffer,
		sourceBufferUsage: normalizePct(jitter / buffer, 0, 1, true),
		sourceBufferUsageBar: progressBar(normalizePct(jitter / buffer, 0, 1, true), 15),

		sourceTotalBitrate: bitrate,
		sourceTotalJitter: jitter,

		// Source Presets
		...Object.fromEntries(self.SOURCE_PRESETS.map((channel, index) => [`presetSource${index}`, channel.id])),
		//...Object.fromEntries(self.SOURCE_PRESETS.map((channel, index) => [`presetSourceURL${index}`, channel.url])),
	})
}
