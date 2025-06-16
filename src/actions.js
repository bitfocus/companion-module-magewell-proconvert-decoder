// ##########################
// #### Instance Actions ####
// ##########################
export function setActions(self) {
	const actions = {}

	actions.videoConfigShowTitle = {
		name: 'Video Config - Show Source Name and Resolution',
		options: [
			{
				type: 'checkbox',
				label: 'Show Source Name and Resolution',
				id: 'show',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-title=' + action.options.show)
		},
	}

	actions.videoConfigShowTally = {
		name: 'Video Config - Show Tally',
		options: [
			{
				type: 'checkbox',
				label: 'Show Tally',
				id: 'show',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-tally=' + action.options.show)
		},
	}

	actions.videoConfigShowVUMeter = {
		name: 'Video Config - Show VU Meter',
		options: [
			{
				type: 'checkbox',
				label: 'Show VU Meter',
				id: 'show',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-vu-meter=' + action.options.show)
		},
	}

	actions.videoConfigVUMeterMode = {
		name: 'Video Config - VU Meter Mode',
		options: [
			{
				type: 'dropdown',
				label: 'VU Meter Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: 'db', label: 'dBVU/dBu scale' },
					{ id: 'post-gain-db', label: 'Post gain dBVU/dBu scale' },
					{ id: 'post-gain-dbfs', label: 'Post gain dBFS scale' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'vu-meter-mode=' + action.options.mode)
		},
	}

	actions.videoConfigShowCenterCross = {
		name: 'Video Config - Show Center Cross',
		options: [
			{
				type: 'checkbox',
				label: 'Show Center Cross',
				id: 'show',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'show-center-cross=' + action.options.show)
		},
	}

	actions.videoConfigSafeAreaMode = {
		name: 'Video Config - Safe Area Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Safe Area Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: '4:3', label: 'Show 4:3 aspect ratio area' },
					{ id: '80%', label: 'Show 80% center view area' },
					{ id: 'square', label: 'Show Square aspect ratio area' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'safe-area-mode=' + action.options.mode)
		},
	}

	actions.videoConfigIdentMode = {
		name: 'Video Config - Ident Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Ident Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: 'ident-text', label: 'Ident Text' },
					{ id: 'device-name', label: 'Device Name' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ident-mode=' + action.options.mode)
		},
	}

	actions.videoConfigIdentText = {
		name: 'Video Config - Ident Text',
		options: [
			{
				type: 'textinput',
				label: 'Ident Text',
				id: 'text',
				default: '',
				useVariables: true,
			},
		],
		callback: async (action) => {
			await self.sendCommand(
				'set-video-config',
				'ident-text=' + (await self.parseVariablesInString(action.options.text)),
			)
		},
	}

	actions.videoConfigHFlip = {
		name: 'Video Config - Horizontal Flip',
		options: [
			{
				type: 'checkbox',
				label: 'Flip',
				id: 'flip',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'h-flip=' + action.options.flip)
		},
	}

	actions.videoConfigVFlip = {
		name: 'Video Config - Vertical Flip',
		options: [
			{
				type: 'checkbox',
				label: 'Flip',
				id: 'flip',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'v-flip=' + action.options.flip)
		},
	}

	actions.videoConfigDeinterlaceMode = {
		name: 'Video Config - Deinterlace Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Deinterlace Mode',
				id: 'mode',
				default: 'bob',
				choices: [
					{ id: 'bob', label: 'Bob' },
					{ id: 'weave', label: 'Weave' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'deinterlace-mode=' + action.options.mode)
		},
	}

	actions.videoConfigARConvertMode = {
		name: 'Video Config - Aspect Ratio Convert Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Aspect Ratio Convert Mode',
				id: 'mode',
				default: 'full',
				choices: [
					{ id: 'windowbox', label: 'Letterbox/Pillarbox' },
					{ id: 'full', label: 'Full Screen' },
					{ id: 'zoom', label: 'Zoom/Crop' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ar-convert-mode=' + action.options.mode)
		},
	}

	actions.videoConfigAutoColorFmt = {
		name: 'Video Config - Auto Color Format',
		options: [
			{
				type: 'checkbox',
				label: 'Auto Color Format',
				id: 'auto',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'in-auto-color-fmt=' + action.options.auto)
		},
	}

	actions.videoConfigColorFmt = {
		name: 'Video Config - Color Format',
		options: [
			{
				type: 'dropdown',
				label: 'Color Format',
				id: 'fmt',
				default: 'bt.709',
				choices: [
					{ id: 'bt.601', label: 'BT.601' },
					{ id: 'bt.709', label: 'BT.709' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'in-color-fmt=' + action.options.fmt)
		},
	}

	actions.videoConfigSwitchMode = {
		name: 'Video Config - Switch Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Switch Mode',
				id: 'mode',
				tooltip: 'Image to show when source is changed',
				default: 'blank',
				choices: [
					{ id: 'blank', label: 'Black Screen' },
					{ id: 'keep-last', label: 'Keep Last Picture' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'switch-mode=' + action.options.mode)
		},
	}

	actions.videoConfigFollowInputMode = {
		name: 'Video Config - Follow Input Mode',
		options: [
			{
				type: 'checkbox',
				label: 'Follow input',
				id: 'mode',
				tooltip: 'Output resolution keeps consistent with that of the input source',
				default: false,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'follow-input-mode=' + action.options.mode)
		},
	}

	actions.audioConfigConvertMode = {
		name: 'Audio Config - Convert Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Convert Mode',
				id: 'mode',
				tooltip: 'Audio scale for the measurement of the volume',
				default: 'smpte',
				choices: [
					{ id: 'smpte', label: 'SMPTE' },
					{ id: 'ebu', label: 'EBU' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-audio-config', 'convert-mode=' + action.options.mode)
		},
	}

	actions.audioConfigGain = {
		name: 'Audio Config - Gain',
		options: [
			{
				type: 'number',
				label: 'Gain',
				id: 'gain',
				tooltip: 'Sets the gain level (-100.00dB - 20.00 dB)',
				min: -100,
				max: 20,
				default: 20.0,
				step: 0.1,
				required: true,
				range: true,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-audio-config', 'gain=' + action.options.gain)
		},
	}

	actions.audioConfigSamplerate = {
		name: 'Audio Config - Samplerate',
		options: [
			{
				type: 'dropdown',
				label: 'Samplerate',
				id: 'samplerate',
				default: '48000',
				choices: [
					{ id: '0', label: 'Follow Input' },
					{ id: '32000', label: '32000 Hz' },
					{ id: '44100', label: '44100 Hz' },
					{ id: '48000', label: '48000 Hz' },
					{ id: '88200', label: '88200 Hz' },
					{ id: '96000', label: '96000 Hz' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-audio-config', 'sample-rate=' + action.options.samplerate)
		},
	}

	actions.audioConfigChannelCount = {
		name: 'Audio Config - Channel count',
		options: [
			{
				type: 'dropdown',
				label: 'Channels',
				id: 'channels',
				default: '0',
				choices: [
					{ id: '0', label: 'Follow Input' },
					{ id: '2', label: '2 Channels' },
					{ id: '4', label: '4 Channels' },
					{ id: '8', label: '8 Channels' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-audio-config', 'channels=' + action.options.channels)
		},
	}

	actions.selectPresetName = {
		name: 'Select Source Preset by Name',
		description: 'Select a source preset for decoding by its preset name',
		options: [
			{
				type: 'dropdown',
				label: 'Preset Name',
				id: 'name',
				choices: self.SOURCE_PRESETS,
				allowCustom: true,
			},
		],
		callback: async (action) => {
			await self.sendCommand(
				'set-channel',
				'ndi-name=' + (action.options.name === '' ? 'true' : 'false') + '&name=' + action.options.name,
			)
		},
	}

	actions.selectPresetIndex = {
		name: 'Select Source Preset by Index',
		description: 'Select a source preset for decoding by its position in the preset list',
		options: [
			{
				type: 'number',
				label: 'Preset #',
				id: 'index',
				required: true,
				min: 0,
				//max: self.SOURCE_PRESETS.length - 1,
				default: 0,
			},
		],
		callback: async (action) => {
			const name =
				action.options.index >= 0 && action.options.index < self.SOURCE_PRESETS.length
					? self.SOURCE_PRESETS[action.options.index].id
					: ''
			await self.sendCommand('set-channel', 'ndi-name=' + (name === '' ? 'true' : 'false') + '&name=' + name)
		},
	}

	actions.selectSourceName = {
		name: 'Select Source',
		description: 'Select either an available NDI source or a Source Preset for decoding',
		options: [
			{
				type: 'checkbox',
				label: 'NDI Source',
				tooltip: 'Enable to select an available NDI source, otherwise select a source from the preset list',
				id: 'isNameNDI',
				default: false,
			},
			{
				type: 'dropdown',
				label: 'Preset Name',
				tooltip:
					'Select a Source Preset name for decoding. Source Presets can be created, edited and removed in the device web interface.' +
					'You can also enter another preset name manually or by using variables.',
				id: 'nameSource',
				choices: self.SOURCE_PRESETS,
				allowCustom: true,
				useVariables: true,
				isVisible: (options) => options.isNameNDI === false,
			},
			{
				type: 'dropdown',
				label: 'Source',
				tooltip:
					'List of NDI sources currently available for decoding. The list is updated automatically.' +
					'You can also enter another NDI source name manually or by using variables.',
				id: 'nameNDI',
				choices: self.NDI_SOURCES,
				allowCustom: true,
				useVariables: true,
				isVisible: (options) => options.isNameNDI === true,
			},
		],
		callback: async (action) => {
			const nameSource = await self.parseVariablesInString(action.options.nameSource)
			const nameNDI = await self.parseVariablesInString(action.options.nameNDI)
			await self.sendCommand(
				'set-channel',
				'ndi-name=' +
					(action.options.isNameNDI || nameSource === '' ? 'true' : 'false') +
					'&name=' +
					(action.options.isNameNDI ? nameNDI : nameSource),
			)
		},
	}

	actions.reboot = {
		name: 'Reboot',
		description: 'Reboots the device without any further confirmation',
		options: [],
		callback: async (action) => {
			await self.sendCommand('reboot')
		},
	}

	return actions
}
