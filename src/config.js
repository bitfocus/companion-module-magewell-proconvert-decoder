export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		label: 'Information',
		value: 'This module will control a Magewell Pro Convert Decoder Device',
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Device IP / Hostname',
		width: 4,
	},
	{
		type: 'static-text',
		id: 'dummy1',
		width: 12,
		label: ' ',
		value: ' ',
	},
	{
		type: 'textinput',
		id: 'username',
		label: 'Username',
		width: 6,
		default: 'Admin',
	},
	{
		type: 'textinput',
		id: 'password',
		label: 'Password',
		width: 6,
		default: 'Admin',
	},
	{
		type: 'static-text',
		id: 'dummy2',
		width: 12,
		label: ' ',
		value: ' ',
	},
	{
		type: 'checkbox',
		id: 'polling',
		width: 2,
		label: 'Enable',
		default: true,
	},
	{
		type: 'static-text',
		id: 'pollInfo',
		width: 7,
		label: 'Polling',
		value:
			'Enables periodic updates of the device status and configuration. This must be activated in order for feedbacks and variables to reflect the current device status. The interval setting specifies the interval (and appropriate timeout) for the repeated requests to the device.',
	},
	{
		type: 'number',
		id: 'pollingrate',
		label: 'Interval (ms)',
		width: 3,
		default: 1000,
		min: 1000,
		max: 10000,
	},
]
