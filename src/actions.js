module.exports = {
	// ##########################
	// #### Instance Actions ####
	// ##########################
	setActions: function () {
		let self = this;
		let actions = {};

		//Video OSD

		actions.videoconfig_showtitle = {
			label: 'Video Config - Show Source Name and Resolution',
			options: [
				{
					type: 'checkbox',
					label: 'Show Source Name and Resolution',
					id: 'show',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'show-title=' + options.show);
			}
		};

		actions.videoconfig_showtally = {
			label: 'Video Config - Show Tally',
			options: [
				{
					type: 'checkbox',
					label: 'Show Tally',
					id: 'show',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'show-tally=' + options.show);
			}
		};

		actions.videoconfig_showvumeter = {
			label: 'Video Config - Show VU Meter',
			options: [
				{
					type: 'checkbox',
					label: 'Show VU Meter',
					id: 'show',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'show-vu-meter=' + options.show);
			}
		};

		actions.videoconfig_vumetermode = {
			label: 'Video Config - VU Meter Mode',
			options: [
				{
					type: 'dropdown',
					label: 'VU Meter Mode',
					id: 'mode',
					default: 'none',
					choices: [
						{ id: 'none', label: 'None'},
						{ id: 'dbu', label: 'dBU'},
						{ id: 'dbvu', label: 'dBVU'},
						{ id: 'dbfs', label: 'dBFS'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'vu-meter-mode=' + options.mode);
			}
		};

		actions.videoconfig_showcentercross = {
			label: 'Video Config - Show Center Cross',
			options: [
				{
					type: 'checkbox',
					label: 'Show Center Cross',
					id: 'show',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'show-center-cross=' + options.show);
			}
		};

		actions.videoconfig_safeareamode = {
			label: 'Video Config - Safe Area Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Safe Area Mode',
					id: 'mode',
					default: 'none',
					choices: [
						{ id: 'none', label: 'None'},
						{ id: '4:3', label: 'Show 4:3 aspect ratio area'},
						{ id: '80%', label: 'Show 80% center view area'},
						{ id: 'square', label: 'Show Square aspect ratio area'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'safe-area-mode=' + options.mode);
			}
		};

		actions.videoconfig_identmode = {
			label: 'Video Config - Ident Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Ident Mode',
					id: 'mode',
					default: 'none',
					choices: [
						{ id: 'none', label: 'None'},
						{ id: 'ident-text', label: 'Ident Text'},
						{ id: 'device-name', label: 'Device Name'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'ident-mode=' + options.mode);
			}
		};

		actions.videoconfig_identtext = {
			label: 'Video Config - Ident Text',
			options: [
				{
					type: 'textinput',
					label: 'Ident Text',
					id: 'text',
					default: ''
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'ident-text=' + options.text);
			}
		};

		//Video Process

		actions.videoconfig_hflip = {
			label: 'Video Config - Horizontal Flip',
			options: [
				{
					type: 'checkbox',
					label: 'Flip',
					id: 'flip',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'h-flip=' + options.flip);
			}
		};

		actions.videoconfig_vflip = {
			label: 'Video Config - Vertical Flip',
			options: [
				{
					type: 'checkbox',
					label: 'Flip',
					id: 'flip',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'v-flip=' + options.flip);
			}
		};

		actions.videoconfig_deinterlacemode = {
			label: 'Video Config - Deinterlace Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Deinterlace Mode',
					id: 'mode',
					default: 'bob',
					choices: [
						{ id: 'bob', label: 'Bob'},
						{ id: 'weave', label: 'Weave'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'deinterlace-mode=' + options.mode);
			}
		};

		actions.videoconfig_arconvertmode = {
			label: 'Video Config - Aspect Ratio Convert Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Aspect Ratio Convert Mode',
					id: 'mode',
					default: 'full',
					choices: [
						{ id: 'windowbox', label: 'Letterbox/Pillarbox'},
						{ id: 'full', label: 'Full Screen'},
						{ id: 'zoom', label: 'Zoom/Crop'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'ar-convert-mode=' + options.mode);
			}
		};

		actions.videoconfig_alphachanneldisplaymode = {
			label: 'Video Config - Alpha Channel Display Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Alpha Channel Display Mode',
					id: 'mode',
					default: 'alpha-only',
					choices: self.CHOICES_ALPHACHANNELDISPLAYMODES
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'alpha-disp-mode=' + options.mode);
			}
		};

		//Video Source

		actions.videoconfig_autocolorfmt = {
			label: 'Video Config - Auto Color Format',
			options: [
				{
					type: 'checkbox',
					label: 'Auto Color Format',
					id: 'auto',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'in-auto-color-fmt=' + options.auto);
			}
		};

		actions.videoconfig_colorfmt = {
			label: 'Video Config - Color Format',
			options: [
				{
					type: 'dropdown',
					label: 'Color Format',
					id: 'fmt',
					default: 'bt.709',
					choices: [
						{ id: 'bt.601', label: 'BT.601'},
						{ id: 'bt.709', label: 'BT.709'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'in-color-fmt=' + options.fmt);
			}
		};

		actions.videoconfig_switchmode = {
			label: 'Video Config - Switch Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Switch Mode',
					id: 'mode',
					tooltip: 'Image to show when source is changed',
					default: 'blank',
					choices: [
						{ id: 'blank', label: 'Black Screen'},
						{ id: 'keep-last', label: 'Keep Last Picture'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-video-config', 'switch-mode=' + options.mode);
			}
		};

		//Video Mode

		actions.set_video_mode = {
			label: 'Set Video Mode',
			options: [
				{
					type: 'textinput',
					label: 'Width',
					id: 'width',
					default: '1920'
				},
				{
					type: 'textinput',
					label: 'Height',
					id: 'height',
					default: '1080'
				},
				{
					type: 'checkbox',
					label: 'Interlaced',
					id: 'interlaced',
					default: false
				},
				{
					type: 'dropdown',
					label: 'Field Rate',
					id: 'fieldrate',
					default: '5000',
					choices: [
						{ id: '2400', label: '24.00'},
						{ id: '2500', label: '25.00'},
						{ id: '2997', label: '29.97'},
						{ id: '3000', label: '30.00'},
						{ id: '5000', label: '50.00'},
						{ id: '5994', label: '50.94'},
						{ id: '6000', label: '60.00'},
					]
				},
				{
					type: 'dropdown',
					label: 'Aspect Ratio',
					id: 'aspectratio',
					default: '16:9',
					choices: [
						{ id: '4:3', label: '4:3'},
						{ id: '16:9', label: '16:9'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				let args = '';

				args += 'width=' + options.width;
				args += '&';
				args += 'height=' + options.height;
				args += '&';
				args += 'interlaced=' + options.interlaced;
				args += '&';
				args += 'field-rate=' + options.fieldrate;
				args += '&';
				args += 'aspect-ratio=' + options.aspectratio;

				self.sendCommand('set-video-mode', args);
			}
		};

		actions.set_audio_config = {
			label: 'Set Audio Config',
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
					range: true
				},
				{
					type: 'dropdown',
					label: 'Sample Rate',
					id: 'samplerate',
					default: '48000',
					choices: [
						{ id: '0', label: 'Follow Input'},
						{ id: '32000', label: '32000 Hz'},
						{ id: '44100', label: '44100 Hz'},
						{ id: '48000', label: '48000 Hz'},
						{ id: '88200', label: '88200 Hz'},
						{ id: '96000', label: '96000 Hz'}
					]
				},
				{
					type: 'dropdown',
					label: 'Channels',
					id: 'channels',
					default: '0',
					choices: [
						{ id: '0', label: 'Follow Input'},
						{ id: '2', label: '2 Channels'},
						{ id: '4', label: '4 Channels'},
						{ id: '8', label: '8 Channels'}
					]
				}
			],
			callback: function(action, bank) {
				let options = action.options;

				let args = '';

				args += 'gain=' + options.gain;
				args += '&';
				args += 'samplerate=' + options.samplerate;
				args += '&';
				args += 'channels=' + options.channels

				self.sendCommand('set-audio-config', args);
			}
		};

		actions.select_preset_channel = {
			label: 'Select Preset Channel to Decode',
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: self.CHOICES_CHANNELS
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				let args = '';

				args = 'name=' + options.channel;
				args += '&ndi-name=false';
				
				self.sendCommand('set-channel', args);
			}
		};

		actions.select_ndi_source = {
			label: 'Select NDI Source to Decode',
			options: [
				{
					type: 'dropdown',
					label: 'NDI Source',
					id: 'ndisource',
					default: self.CHOICES_NDI_SOURCES[0].id,
					choices: self.CHOICES_NDI_SOURCES
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				let args = '';

				args = 'name=' + options.ndisource;
				args += '&ndi-name=true';
				
				self.sendCommand('set-channel', args);
			}
		};

		actions.set_ndi_config = {
			label: 'Set NDI Config',
			options: [
				{
					type: 'checkbox',
					label: 'Enable Discovery Server',
					id: 'enablediscovery',
					default: false
				},
				{
					type: 'textinput',
					label: 'Discovery Server IP Address',
					id: 'discoveryserver',
					default: '192.168.0.1',
					regex: self.REGEX_IP
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
					default: 'public'
				},
				{
					type: 'checkbox',
					label: 'Low Bandwidth',
					id: 'lowbandwidth',
					default: false
				}
			],
			callback: function(action, bank) {
				let options = action.options;
				let args = '';

				args += 'enable-discovery=' + options.enablediscovery;
				args += '&';
				args += 'discovery-server=' + options.discoveryserver;
				//args += '&';
				//args += 'source-name=' + options.sourcename;
				args += '&';
				args += 'group-name=' + options.groupname;
				args += '&';
				args += 'low-bandwidth=' + options.lowbandwidth;
				
				self.sendCommand('set-ndi-config', args);
			}
		};

		actions.set_playback_config = {
			label: 'Set Playback Config',
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
					range: true
				},
			],
			callback: function(action, bank) {
				let options = action.options;
				self.sendCommand('set-playback-config', 'buffer-duration=' + options.duration);
			}
		};

		return actions
	}
}