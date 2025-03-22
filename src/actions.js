// ##########################
// #### Instance Actions ####
// ##########################
export function setActions(self) {
	const actions = {}

	//Video OSD

	actions.videoconfig_showtitle = {
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

	actions.videoconfig_showtally = {
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

	actions.videoconfig_showvumeter = {
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

	actions.videoconfig_vumetermode = {
		name: 'Video Config - VU Meter Mode',
		options: [
			{
				type: 'dropdown',
				label: 'VU Meter Mode',
				id: 'mode',
				default: 'none',
				choices: [
					{ id: 'none', label: 'None' },
					{ id: 'dbu', label: 'dBU' },
					{ id: 'dbvu', label: 'dBVU' },
					{ id: 'dbfs', label: 'dBFS' },
				],
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'vu-meter-mode=' + action.options.mode)
		},
	}

	actions.videoconfig_showcentercross = {
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

	actions.videoconfig_safeareamode = {
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

	actions.videoconfig_identmode = {
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

	actions.videoconfig_identtext = {
		name: 'Video Config - Ident Text',
		options: [
			{
				type: 'textinput',
				label: 'Ident Text',
				id: 'text',
				default: '',
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'ident-text=' + action.options.text)
		},
	}

	//Video Process

	actions.videoconfig_hflip = {
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

	actions.videoconfig_vflip = {
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

	actions.videoconfig_deinterlacemode = {
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

	actions.videoconfig_arconvertmode = {
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

	actions.videoconfig_alphachanneldisplaymode = {
		name: 'Video Config - Alpha Channel Display Mode',
		options: [
			{
				type: 'dropdown',
				label: 'Alpha Channel Display Mode',
				id: 'mode',
				default: 'alpha-only',
				choices: self.CHOICES_ALPHACHANNELDISPLAYMODES,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-video-config', 'alpha-disp-mode=' + action.options.mode)
		},
	}

	//Video Source

	actions.videoconfig_autocolorfmt = {
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

	actions.videoconfig_colorfmt = {
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

	actions.videoconfig_switchmode = {
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

	//Video Mode

	actions.set_video_mode = {
		name: 'Set Video Mode',
		options: [
			{
				type: 'textinput',
				label: 'Width',
				id: 'width',
				default: '1920',
			},
			{
				type: 'textinput',
				label: 'Height',
				id: 'height',
				default: '1080',
			},
			{
				type: 'checkbox',
				label: 'Interlaced',
				id: 'interlaced',
				default: false,
			},
			{
				type: 'dropdown',
				label: 'Field Rate',
				id: 'fieldrate',
				default: '5000',
				choices: [
					{ id: '2400', label: '24.00' },
					{ id: '2500', label: '25.00' },
					{ id: '2997', label: '29.97' },
					{ id: '3000', label: '30.00' },
					{ id: '5000', label: '50.00' },
					{ id: '5994', label: '50.94' },
					{ id: '6000', label: '60.00' },
				],
			},
			{
				type: 'dropdown',
				label: 'Aspect Ratio',
				id: 'aspectratio',
				default: '16:9',
				choices: [
					{ id: '4:3', label: '4:3' },
					{ id: '16:9', label: '16:9' },
				],
			},
		],
		callback: async (action) => {
			let args = ''

			args += 'width=' + action.options.width
			args += '&'
			args += 'height=' + action.options.height
			args += '&'
			args += 'interlaced=' + action.options.interlaced
			args += '&'
			args += 'field-rate=' + action.options.fieldrate
			args += '&'
			args += 'aspect-ratio=' + action.options.aspectratio

			await self.sendCommand('set-video-mode', args)
		},
	}

	actions.set_audio_config = {
		name: 'Set Audio Config',
		options: [
			{
				type: 'number',
				label: 'Gain',
				id: 'gain',
				tooltip: 'Sets the gain level (-100.00dB - 20.00 dB)',
				min: -100,
				max: 20,
				default: 0.0,
				step: 0.1,
				required: true,
				range: true,
			},
			{
				type: 'dropdown',
				label: 'Sample Rate',
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
			let args = ''

			args += 'gain=' + action.options.gain
			args += '&'
			args += 'samplerate=' + action.options.samplerate
			args += '&'
			args += 'channels=' + action.options.channels

			await self.sendCommand('set-audio-config', args)
		},
	}

	actions.select_preset_channel = {
		name: 'Select Preset Channel to Decode',
		options: [
			{
				type: 'dropdown',
				label: 'Channel',
				id: 'channel',
				choices: self.CHOICES_CHANNELS,
			},
		],
		callback: async (action) => {
			let args = ''

			args = 'name=' + action.options.channel
			args += '&ndi-name=false'

			await self.sendCommand('set-channel', args)
		},
	}

	actions.select_ndi_source = {
		name: 'Select NDI Source to Decode',
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				id: 'ndisource',
				default: self.CHOICES_NDI_SOURCES[0].id,
				choices: self.CHOICES_NDI_SOURCES,
			},
		],
		callback: async (action) => {
			let args = ''

			args = 'name=' + action.options.ndisource
			args += '&ndi-name=true'

			await self.sendCommand('set-channel', args)
		},
	}

	actions.set_ndi_config = {
		name: 'Set NDI Config',
		options: [
			{
				type: 'checkbox',
				label: 'Enable Discovery Server',
				id: 'enablediscovery',
				default: false,
			},
			{
				type: 'textinput',
				label: 'Discovery Server IP Address',
				id: 'discoveryserver',
				default: '192.168.0.1',
				regex: self.REGEX_IP,
			},
			/*{
					type: 'dropdown',
					label: 'Source Name',
					id: 'sourcename',
					default: self.CHOICES_NDI_SOURCES[0].id,
					choices: self.CHOICES_NDI_SOURCES
				},*/
			{
				type: 'textinput',
				label: 'Group Name',
				id: 'groupname',
				default: 'public',
			},
			{
				type: 'checkbox',
				label: 'Low Bandwidth',
				id: 'lowbandwidth',
				default: false,
			},
		],
		callback: async (action) => {
			let args = ''

			args += 'enable-discovery=' + action.options.enablediscovery
			args += '&'
			args += 'discovery-server=' + action.options.discoveryserver
			//args += '&';
			//args += 'source-name=' + action.options.sourcename;
			args += '&'
			args += 'group-name=' + action.options.groupname
			args += '&'
			args += 'low-bandwidth=' + action.options.lowbandwidth

			await self.sendCommand('set-ndi-config', args)
		},
	}

	actions.set_playback_config = {
		name: 'Set Playback Config',
		options: [
			{
				type: 'number',
				label: 'Buffer Duration',
				id: 'duration',
				tooltip: 'Sets the buffer time from 20 to 120 ms',
				min: 20,
				max: 120,
				default: 20,
				step: 1,
				required: true,
				range: true,
			},
		],
		callback: async (action) => {
			await self.sendCommand('set-playback-config', 'buffer-duration=' + action.options.duration)
		},
	}

	return actions
}
