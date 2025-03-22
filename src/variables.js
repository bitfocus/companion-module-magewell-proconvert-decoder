// ##########################
// #### Define Variables ####
// ##########################
export function setVariables(self) {
	const variables = []

	variables.push({ variableId: 'information', name: 'Information' })

	variables.push({ variableId: 'name', name: 'Device Name' })
	variables.push({ variableId: 'model', name: 'Device Model' })
	variables.push({ variableId: 'product_id', name: 'Product ID' })
	variables.push({ variableId: 'auth_type', name: 'Auth Type' })
	variables.push({ variableId: 'serial_number', name: 'Serial Number' })
	variables.push({ variableId: 'hw_revision', name: 'HW Revision' })
	variables.push({ variableId: 'fw_version', name: 'FW Version' })
	variables.push({ variableId: 'uptodate', name: 'Up To Date' })
	variables.push({ variableId: 'output_state', name: 'Output State' })
	variables.push({ variableId: 'cpu_usage', name: 'CPU Usage' })
	variables.push({ variableId: 'memory_usage', name: 'Memory Usage' })
	variables.push({ variableId: 'core_temp', name: 'Core Temp' })
	variables.push({ variableId: 'board_id', name: 'Board ID' })
	variables.push({ variableId: 'up_time', name: 'UP Time' })
	variables.push({ variableId: 'sd_size', name: 'SD Size' })

	variables.push({ variableId: 'ndi_name', name: 'NDI Name' })
	variables.push({ variableId: 'ndi_connected', name: 'NDI Connected' })

	//Video Config - OSD
	variables.push({ variableId: 'show_title', name: 'Show Source Name and Resolution' })
	variables.push({ variableId: 'show_tally', name: 'Show Tally' })
	variables.push({ variableId: 'show_vumeter', name: 'Show VU Meter' })
	variables.push({ variableId: 'vumeter_mode', name: 'VU Meter Mode' })
	variables.push({ variableId: 'show_center_cross', name: 'Show Center Cross' })
	variables.push({ variableId: 'safe_area_mode', name: 'Safe Area Mode' })
	variables.push({ variableId: 'ident_mode', name: 'Ident Mode' })
	variables.push({ variableId: 'ident_text', name: 'Ident Text' })

	//Video Config - Process
	variables.push({ variableId: 'h_flip', name: 'Horizonal Flip' })
	variables.push({ variableId: 'v_flip', name: 'Vertical Flip' })
	variables.push({ variableId: 'deinterlace_mode', name: 'Deinterlace Mode' })
	variables.push({ variableId: 'ar_convert_mode', name: 'Aspect Ratio Convert Mode' })
	variables.push({ variableId: 'alpha_disp_mode', name: 'Alpha Channel Display Mode' })

	//Video Config - Source
	variables.push({ variableId: 'auto_color_fmt', name: 'Auto Color Format' })
	variables.push({ variableId: 'color_fmt', name: 'Color Format' })
	variables.push({ variableId: 'switch_mode', name: 'Switch Mode' })

	//Video Mode
	variables.push({ variableId: 'width', name: 'Width' })
	variables.push({ variableId: 'height', name: 'Height' })
	variables.push({ variableId: 'interlaced', name: 'Interlaced' })
	variables.push({ variableId: 'field_rate', name: 'Field Rate' })
	variables.push({ variableId: 'aspect_ratio', name: 'Aspect Ratio' })

	//Audio Config
	variables.push({ variableId: 'audio_gain', name: 'Audio Gain' })
	variables.push({ variableId: 'audio_samplerate', name: 'Audio Sample Rate' })
	variables.push({ variableId: 'audio_channels', name: 'Audio Channel Mode' })

	//Channels and NDI Sources
	variables.push({ variableId: 'current_channel', name: 'Current Channel' })
	variables.push({ variableId: 'current_channel_ndi', name: 'Current Channel is NDI' })
	variables.push({ variableId: 'ndi_enable_discovery', name: 'NDI Discovery Enabled' })
	variables.push({ variableId: 'ndi_discovery_server', name: 'NDI Discovery Server' })
	//variables.push({ variableId: 'ndi_source_name', name: 'NDI Source Name' });
	variables.push({ variableId: 'ndi_group_name', name: 'NDI Group Name' })
	variables.push({ variableId: 'ndi_low_bandwidth', name: 'NDI Low Bandwidth' })
	variables.push({ variableId: 'ndi_buffer_duration', name: 'Buffer Duration' })

	//Network
	variables.push({ variableId: 'network_use_dhcp', name: 'Network Use DHCP' })
	variables.push({ variableId: 'network_device_name', name: 'Network Device Name' })
	variables.push({ variableId: 'network_state', name: 'Network State' })
	variables.push({ variableId: 'network_mac', name: 'Network MAC Address' })
	variables.push({ variableId: 'network_tx', name: 'Network TX Speed Kbps' })
	variables.push({ variableId: 'network_rx', name: 'Network RX Speed Kbps' })

	return variables
	return variables
}

// #########################
// #### Check Variables ####
// #########################
export function checkVariables(self) {
	self.setVariableValues({
		information: self.STATUS.information,

		name: self.STATUS.summary.name,
		model: self.STATUS.summary.model,
		product_id: self.STATUS.summary.productId,
		auth_type: self.STATUS.summary.authType,
		serial_number: self.STATUS.summary.serialNumber,
		hw_revision: self.STATUS.summary.hwRevision,
		fw_version: self.STATUS.summary.fwVersion,
		uptodate: self.STATUS.summary.uptodate.toString(),
		output_state: self.STATUS.summary.outputState,
		cpu_usage: self.STATUS.summary.cpuUsage,
		memory_usage: self.STATUS.summary.memoryUsage,
		core_temp: self.STATUS.summary.coreTemp,
		board_id: self.STATUS.summary.boardId,
		up_time: self.STATUS.summary.upTime,
		sd_size: self.STATUS.summary.sdSize,

		ndi_name: self.STATUS.summary.ndi.name,
		ndi_connected: self.STATUS.summary.ndi.connected.toString(),

		//Video Config - OSD
		show_title: self.STATUS.videoConfig.showTitle.toString(),
		show_tally: self.STATUS.videoConfig.showTally.toString(),
		show_vumeter: self.STATUS.videoConfig.showVUMeter.toString(),
		vumeter_mode: self.STATUS.videoConfig.VUMeterMode,
		show_center_cross: self.STATUS.videoConfig.showCenterCross.toString(),
		safe_area_mode: self.STATUS.videoConfig.safeAreaMode,
		ident_mode: self.STATUS.videoConfig.identMode,
		ident_text: self.STATUS.videoConfig.identText,

		//Video Config - Process
		h_flip: self.STATUS.videoConfig.hFlip.toString(),
		v_flip: self.STATUS.videoConfig.vFlip.toString(),
		deinterlace_mode: self.STATUS.videoConfig.deinterlaceMode,
		ar_convert_mode: self.STATUS.videoConfig.arConvertMode,
		alpha_disp_mode: self.STATUS.videoConfig.alphaDispMode,

		//Video Config - Source
		auto_color_fmt: self.STATUS.videoConfig.autoColorFmt.toString(),
		color_fmt: self.STATUS.videoConfig.colorFmt,
		switch_mode: self.STATUS.videoConfig.switchMode,

		//Video Mode
		width: self.STATUS.videoMode.width,
		height: self.STATUS.videoMode.height,
		interlaced: self.STATUS.videoMode.interlaced.toString(),
		field_rate: self.STATUS.videoMode.fieldRate,
		aspect_ratio: self.STATUS.videoMode.aspectRatio,

		//Audio Config
		audio_gain: self.STATUS.audioConfig.gain,
		audio_samplerate: self.STATUS.audioConfig.sampleRate,
		audio_channels: self.STATUS.audioConfig.channels,

		//Channels and NDI Sources
		current_channel: self.STATUS.channelConfig.currentChannel,
		current_channel_ndi: self.STATUS.channelConfig.currentChannelNDI.toString(),
		ndi_enable_discovery: self.STATUS.channelConfig.NDIEnableDiscovery.toString(),
		ndi_discovery_server: self.STATUS.channelConfig.NDIDiscoveryServer,
		//ndi_source_name: self.STATUS.channelConfig.NDISourceName,;
		ndi_group_name: self.STATUS.channelConfig.NDIGroupName,
		ndi_low_bandwidth: self.STATUS.channelConfig.NDILowBandwidth.toString(),
		ndi_buffer_duration: self.STATUS.channelConfig.bufferDuration,

		//Network Config
		network_use_dhcp: self.STATUS.networkConfig.useDHCP,
		network_device_name: self.STATUS.networkConfig.deviceName,
		network_state: self.STATUS.networkConfig.state,
		network_mac: self.STATUS.networkConfig.mac,
		network_tx: self.STATUS.networkConfig.tx,
		network_rx: self.STATUS.networkConfig.rx,
	})
}
