import { combineRgb } from '@companion-module/base'

// ##########################
// #### Define Feedbacks ####
// ##########################
export function setFeedbacks(self) {
	const feedbacks = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorGreen = combineRgb(0, 255, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorBlue = combineRgb(0, 51, 204)
	const colorGrey = combineRgb(51, 51, 51)

	feedbacks.channelSelected = {
		type: 'boolean',
		name: 'Show Channel is Selected On Button',
		description: 'Indicate if Channel is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'Channel',
				id: 'channel',
				choices: self.CHOICES_CHANNELS,
			},
		],
		callback: function () {
			if (self.STATUS.channelConfig.currentChannel.toString() == feedbacks.options.channel.toString()) {
				return true
			}

			return false
		},
	}

	feedbacks.ndiSelected = {
		type: 'boolean',
		name: 'Show NDI Source is Selected On Button',
		description: 'Indicate if NDI Source is currently selected for decoding',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		options: [
			{
				type: 'dropdown',
				label: 'NDI Source',
				id: 'source',
				choices: self.CHOICES_NDI_SOURCES,
			},
		],
		callback: function () {
			if (self.STATUS.channelConfig.currentChannel.toString() == feedbacks.options.source.toString()) {
				return true
			}

			return false
		},
	}

	feedbacks.ndiConnected = {
		type: 'boolean',
		name: 'NDI is Connected',
		description: 'Indicate if selected NDI Source is Connected',
		defaultStyle: {
			color: colorWhite,
			bgcolor: colorRed,
		},
		callback: function () {
			if (self.STATUS.summary.ndi.connected) {
				return true
			}

			return false
		},
	}

	return feedbacks
}
