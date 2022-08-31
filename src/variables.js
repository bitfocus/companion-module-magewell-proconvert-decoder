module.exports = {
	// ##########################
	// #### Define Variables ####
	// ##########################
	setVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ name: 'information', label: 'Information' });

		variables.push({ name: 'name', label: 'Device Name' });
		variables.push({ name: 'model', label: 'Device Model' });
		variables.push({ name: 'product_id', label: 'Product ID' });
		variables.push({ name: 'auth_type', label: 'Auth Type' });
		variables.push({ name: 'serial_number', label: 'Serial Number' });
		variables.push({ name: 'hw_revision', label: 'HW Revision' });
		variables.push({ name: 'fw_version', label: 'FW Version' });
		variables.push({ name: 'uptodate', label: 'Up To Date' });
		variables.push({ name: 'output_state', label: 'Output State' });
		variables.push({ name: 'cpu_usage', label: 'CPU Usage' });
		variables.push({ name: 'memory_usage', label: 'Memory Usage' });
		variables.push({ name: 'core_temp', label: 'Core Temp' });
		variables.push({ name: 'board_id', label: 'Board ID' });
		variables.push({ name: 'up_time', label: 'UP Time' });
		variables.push({ name: 'sd_size', label: 'SD Size' });

		variables.push({ name: 'ndi_name', label: 'NDI Name' });
		variables.push({ name: 'ndi_connected', label: 'NDI Connected' });

		//Video Config - OSD
		variables.push({ name: 'show_title', label: 'Show Source Name and Resolution' });
		variables.push({ name: 'show_tally', label: 'Show Tally' });
		variables.push({ name: 'show_vumeter', label: 'Show VU Meter' });
		variables.push({ name: 'vumeter_mode', label: 'VU Meter Mode' });
		variables.push({ name: 'show_center_cross', label: 'Show Center Cross' });
		variables.push({ name: 'safe_area_mode', label: 'Safe Area Mode' });
		variables.push({ name: 'ident_mode', label: 'Ident Mode' });
		variables.push({ name: 'ident_text', label: 'Ident Text' });

		//Video Config - Process
		variables.push({ name: 'h_flip', label: 'Horizonal Flip' });
		variables.push({ name: 'v_flip', label: 'Vertical Flip' });
		variables.push({ name: 'deinterlace_mode', label: 'Deinterlace Mode' });
		variables.push({ name: 'ar_convert_mode', label: 'Aspect Ratio Convert Mode' });
		variables.push({ name: 'alpha_disp_mode', label: 'Alpha Channel Display Mode' });

		//Video Config - Source
		variables.push({ name: 'auto_color_fmt', label: 'Auto Color Format' });
		variables.push({ name: 'color_fmt', label: 'Color Format' });
		variables.push({ name: 'switch_mode', label: 'Switch Mode' });

		//Video Mode
		variables.push({ name: 'width', label: 'Width' });
		variables.push({ name: 'height', label: 'Height' });
		variables.push({ name: 'interlaced', label: 'Interlaced' });
		variables.push({ name: 'field_rate', label: 'Field Rate' });
		variables.push({ name: 'aspect_ratio', label: 'Aspect Ratio' });

		//Audio Config
		variables.push({ name: 'audio_gain', label: 'Audio Gain' });
		variables.push({ name: 'audio_samplerate', label: 'Audio Sample Rate' });
		variables.push({ name: 'audio_channels', label: 'Audio Channel Mode' });

		//Channels and NDI Sources
		variables.push({ name: 'current_channel', label: 'Current Channel' });
		variables.push({ name: 'current_channel_ndi', label: 'Current Channel is NDI' });
		variables.push({ name: 'ndi_enable_discovery', label: 'NDI Discovery Enabled' });
		variables.push({ name: 'ndi_discovery_server', label: 'NDI Discovery Server' });
		//variables.push({ name: 'ndi_source_name', label: 'NDI Source Name' });
		variables.push({ name: 'ndi_group_name', label: 'NDI Group Name' });
		variables.push({ name: 'ndi_low_bandwidth', label: 'NDI Low Bandwidth' });
		variables.push({ name: 'ndi_buffer_duration', label: 'Buffer Duration' });

		//Network
		variables.push({ name: 'network_use_dhcp', label: 'Network Use DHCP' });
		variables.push({ name: 'network_device_name', label: 'Network Device Name' });
		variables.push({ name: 'network_state', label: 'Network State' });
		variables.push({ name: 'network_mac', label: 'Network MAC Address' });
		variables.push({ name: 'network_tx', label: 'Network TX Speed Kbps' });
		variables.push({ name: 'network_rx', label: 'Network RX Speed Kbps' });

		return variables
	},

	// #########################
	// #### Check Variables ####
	// #########################
	checkVariables: function () {
		let self = this;

		try {
			self.setVariable('information', self.STATUS.information);

			self.setVariable('name', self.STATUS.summary.name);
			self.setVariable('model', self.STATUS.summary.model);
			self.setVariable('product_id',  self.STATUS.summary.productId);
			self.setVariable('auth_type',  self.STATUS.summary.authType);
			self.setVariable('serial_number',  self.STATUS.summary.serialNumber);
			self.setVariable('hw_revision',  self.STATUS.summary.hwRevision);
			self.setVariable('fw_version',  self.STATUS.summary.fwVersion);
			self.setVariable('uptodate',  self.STATUS.summary.uptodate.toString());
			self.setVariable('output_state',  self.STATUS.summary.outputState);
			self.setVariable('cpu_usage',  self.STATUS.summary.cpuUsage);
			self.setVariable('memory_usage', self.STATUS.summary.memoryUsage);
			self.setVariable('core_temp',  self.STATUS.summary.coreTemp);
			self.setVariable('board_id', self.STATUS.summary.boardId);
			self.setVariable('up_time', self.STATUS.summary.upTime);
			self.setVariable('sd_size',  self.STATUS.summary.sdSize);

			self.setVariable('ndi_name',  self.STATUS.summary.ndi.name);
			self.setVariable('ndi_connected',  self.STATUS.summary.ndi.connected.toString());

			//Video Config - OSD
			self.setVariable('show_title', self.STATUS.videoConfig.showTitle.toString());
			self.setVariable('show_tally', self.STATUS.videoConfig.showTally.toString());
			self.setVariable('show_vumeter', self.STATUS.videoConfig.showVUMeter.toString());
			self.setVariable('vumeter_mode', self.STATUS.videoConfig.VUMeterMode);
			self.setVariable('show_center_cross', self.STATUS.videoConfig.showCenterCross.toString());
			self.setVariable('safe_area_mode', self.STATUS.videoConfig.safeAreaMode);
			self.setVariable('ident_mode', self.STATUS.videoConfig.identMode);
			self.setVariable('ident_text', self.STATUS.videoConfig.identText);

			//Video Config - Process
			self.setVariable('h_flip', self.STATUS.videoConfig.hFlip.toString());
			self.setVariable('v_flip', self.STATUS.videoConfig.vFlip.toString());
			self.setVariable('deinterlace_mode', self.STATUS.videoConfig.deinterlaceMode);
			self.setVariable('ar_convert_mode', self.STATUS.videoConfig.arConvertMode);
			self.setVariable('alpha_disp_mode', self.STATUS.videoConfig.alphaDispMode);

			//Video Config - Source
			self.setVariable('auto_color_fmt', self.STATUS.videoConfig.autoColorFmt.toString());
			self.setVariable('color_fmt', self.STATUS.videoConfig.colorFmt);
			self.setVariable('switch_mode', self.STATUS.videoConfig.switchMode);

			//Video Mode
			self.setVariable('width', self.STATUS.videoMode.width);
			self.setVariable('height', self.STATUS.videoMode.height);
			self.setVariable('interlaced', self.STATUS.videoMode.interlaced.toString());
			self.setVariable('field_rate', self.STATUS.videoMode.fieldRate);
			self.setVariable('aspect_ratio', self.STATUS.videoMode.aspectRatio);

			//Audio Config
			self.setVariable('audio_gain', self.STATUS.audioConfig.gain);
			self.setVariable('audio_samplerate', self.STATUS.audioConfig.sampleRate);
			self.setVariable('audio_channels', self.STATUS.audioConfig.channels);

			//Channels and NDI Sources
			self.setVariable('current_channel', self.STATUS.channelConfig.currentChannel);
			self.setVariable('current_channel_ndi', self.STATUS.channelConfig.currentChannelNDI.toString());
			self.setVariable('ndi_enable_discovery', self.STATUS.channelConfig.NDIEnableDiscovery.toString());
			self.setVariable('ndi_discovery_server', self.STATUS.channelConfig.NDIDiscoveryServer);
			//self.setVariable('ndi_source_name', self.STATUS.channelConfig.NDISourceName);
			self.setVariable('ndi_group_name', self.STATUS.channelConfig.NDIGroupName);
			self.setVariable('ndi_low_bandwidth', self.STATUS.channelConfig.NDILowBandwidth.toString());
			self.setVariable('ndi_buffer_duration', self.STATUS.channelConfig.bufferDuration);

			//Network Config
			self.setVariable('network_use_dhcp', self.STATUS.networkConfig.useDHCP);
			self.setVariable('network_device_name', self.STATUS.networkConfig.deviceName);
			self.setVariable('network_state', self.STATUS.networkConfig.state);
			self.setVariable('network_mac', self.STATUS.networkConfig.mac);
			self.setVariable('network_tx', self.STATUS.networkConfig.tx);
			self.setVariable('network_rx', self.STATUS.networkConfig.rx);
		}
		catch(error) {
			self.log('error', 'Error setting Variables from Device: ' + String(error));
		}
	}
}