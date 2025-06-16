import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	const presets = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 204, 0)
	const colorYellow = combineRgb(255, 255, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorPurple = combineRgb(255, 0, 255)
	const colorDarkRed = combineRgb(102, 0, 0)
	const colorBlack = combineRgb(0, 0, 0)

	const colorMagewellAttention = '#ee9c26'
	const colorMagewellActive = '#1f8eec'
	const colorMagewellHighlight = '#edf6fe'
	const colorMagewellMenu = '#383838'
	const colorMagewellGrey = '#8d8d8d'

	presets['dashboardSourceConnected'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Source Connected',
		style: {
			text: 'SOURCE\\n$(generic-module:sourceName)',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sourceConnected',
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
		],
	}

	presets['dashboardQoS'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'QoS Video/Audio Dropped Frames/Samples',
		style: {
			text: 'QoS\\n$(generic-module:sourceVideoDropFrames)\\n$(generic-module:sourceAudioDropSamples)',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [
			{
				feedbackId: 'sourceQosDrop',
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['dashboardDecoding'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Decoding Video/Audio Bitrate',
		style: {
			text: 'Decoding\\n$(generic-module:sourceVideoBitrate) k\\n$(generic-module:sourceAudioBitrate) k',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardJitter'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Jitter Video/Audio',
		style: {
			text: 'Jitter\\n$(generic-module:sourceVideoJitter) ms\\n$(generic-module:sourceAudioJitter) ms',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardJitterBuffer'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Buffer Usage',
		style: {
			text: 'Buffer\\n$(generic-module:sourceBufferDuration) ms\\n$(generic-module:sourceBufferBar)',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardVideoFmt'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Video Format',
		style: {
			text: 'Video\\n$(generic-module:sourceVideoHeight)$(generic-module:sourceVideoScanShort)\\n$(generic-module:sourceVideoFieldrate) Hz',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardAudioFmt'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Audio Format',
		style: {
			text: 'Audio\\n$(generic-module:sourceAudioNumChannels)x$(generic-module:sourceAudioBitCount) Bit\\n$(generic-module:sourceAudioSamplerate) Hz',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [],
		feedbacks: [],
	}

	presets['dashboardTallyProgram'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Tally Program',
		style: {
			text: '⚪ TALLY\\nProgram',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sourceTallyProgram',
				style: {
					color: colorWhite,
					bgcolor: colorRed,
				},
			},
		],
	}

	presets['dashboardTallyPreview'] = {
		type: 'button',
		category: 'Dashboard',
		name: 'Tally Preview',
		style: {
			text: '⚪ TALLY\\nPreview',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [],
				up: [],
			},
		],
		feedbacks: [
			{
				feedbackId: 'sourceTallyPreview',
				style: {
					color: colorWhite,
					bgcolor: colorGreen,
				},
			},
		],
	}

	presets['systemReboot'] = {
		type: 'button',
		category: 'System',
		name: 'Reboot Device (Hold for 2s)',
		style: {
			text: 'Reboot\\n↺',
			size: '14',
			color: colorWhite,
			bgcolor: colorMagewellAttention,
		},
		options: {
			relativeDelay: false,
		},
		steps: [
			{
				down: [],
				up: [],
				2000: {
					options: { runWhileHeld: true },
					actions: [
						{
							actionId: 'reboot',
							options: {},
						},
					],
				},
			},
		],
		feedbacks: [],
	}

	presets['videoFollowInput'] = {
		type: 'button',
		category: 'System',
		name: 'Video Follow Input',
		style: {
			text: 'Video Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'videoConfigFollowInputMode',
						options: {
							mode: true,
						},
					},
					{
						actionId: 'videoConfigDeinterlaceMode',
						options: {
							mode: 'weave',
						},
					},
					{
						actionId: 'videoConfigAutoColorFmt',
						options: {
							auto: true,
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['audioFollowInput'] = {
		type: 'button',
		category: 'System',
		name: 'Audio Follow Input',
		style: {
			text: 'Audio Follow Input',
			size: '14',
			color: colorWhite,
			bgcolor: colorBlack,
		},
		steps: [
			{
				down: [
					{
						actionId: 'audioConfigGain',
						options: {
							gain: 20.0,
						},
					},
					{
						actionId: 'audioConfigConvertMode',
						options: {
							mode: 'smpte',
						},
					},
					{
						actionId: 'audioConfigSamplerate',
						options: {
							samplerate: '0',
						},
					},
					{
						actionId: 'audioConfigChannelCount',
						options: {
							channels: '0',
						},
					},
					{
						actionId: 'videoConfigVUMeterMode',
						options: {
							mode: 'post-gain-dbfs',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	// #################
	// #### Presets ####
	// #################

	self.SOURCE_PRESETS.forEach((preset, index) => {
		presets[`presetName${index}`] = {
			type: 'button',
			category: 'Source Presets by Name',
			name: `Select SOURCE "${preset.id}"`,
			style: {
				text: `SELECT\\nSOURCE PRESET\\n\\n${preset.id}`,
				size: '7',
				color: colorBlack,
				bgcolor: colorWhite,
			},
			steps: [
				{
					down: [
						{
							actionId: 'selectPresetName',
							options: {
								name: preset.id,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetName',
					options: {
						name: preset.id,
					},
					style: {
						color: colorMagewellHighlight,
						bgcolor: colorMagewellActive,
					},
				},
			],
		}
	})

	self.SOURCE_PRESETS.forEach((preset, index) => {
		presets[`presetIndex${index}`] = {
			type: 'button',
			category: 'Source Presets by Index',
			name: `Select Source Preset #${index}`,
			style: {
				text: `SELECT\\nSOURCE PRESET\\nINDEX #${index}\\n\\n$(generic-module:presetSource${index})`,
				size: '7',
				color: colorBlack,
				bgcolor: colorWhite,
			},
			steps: [
				{
					down: [
						{
							actionId: 'selectPresetIndex',
							options: {
								index: index,
							},
						},
					],
					up: [],
				},
			],
			feedbacks: [
				{
					feedbackId: 'sourcePresetIndex',
					options: {
						index: index,
					},
					style: {
						color: colorMagewellHighlight,
						bgcolor: colorMagewellActive,
					},
				},
			],
		}
	})

	return presets
}
