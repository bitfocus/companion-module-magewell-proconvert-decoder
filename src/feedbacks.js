module.exports = {
	// ##########################
	// #### Define Feedbacks ####
	// ##########################
	setFeedbacks: function () {
		let self = this;
		let feedbacks = {};

		const foregroundColor = self.rgb(255, 255, 255) // White
		const backgroundColorRed = self.rgb(255, 0, 0) // Red
		const backgroundColorGreen = self.rgb(0, 255, 0) // Green
		const backgroundColorOrange = self.rgb(255, 102, 0) // Orange

		feedbacks.channelSelected = {
			type: 'boolean',
			label: 'Show Channel is Selected On Button',
			description: 'Indicate if Channel is currently selected for decoding',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Channel',
					id: 'channel',
					choices: self.CHOICES_CHANNELS
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.STATUS.channelConfig.currentChannel.toString() == opt.channel.toString()) {
					return true;
				}

				return false
			}
		}

		feedbacks.ndiSelected = {
			type: 'boolean',
			label: 'Show NDI Source is Selected On Button',
			description: 'Indicate if NDI Source is currently selected for decoding',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			options: [
				{
					type: 'dropdown',
					label: 'NDI Source',
					id: 'source',
					choices: self.CHOICES_NDI_SOURCES
				}
			],
			callback: function (feedback, bank) {
				let opt = feedback.options;

				if (self.STATUS.channelConfig.currentChannel.toString() == opt.source.toString()) {
					return true;
				}

				return false
			}
		}

		feedbacks.ndiConnected = {
			type: 'boolean',
			label: 'NDI is Connected',
			description: 'Indicate if selected NDI Source is Connected',
			style: {
				color: foregroundColor,
				bgcolor: backgroundColorRed,
			},
			callback: function (feedback, bank) {
				let opt = feedback.options;
				
				if (self.STATUS.summary.ndi.connected) {
					return true;
				}

				return false
			}
		}

		return feedbacks
	}
}
