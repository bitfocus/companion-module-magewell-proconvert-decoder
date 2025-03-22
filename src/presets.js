import { combineRgb } from '@companion-module/base'

export function setPresets(self) {
	const presets = {}

	const colorWhite = combineRgb(255, 255, 255)
	const colorRed = combineRgb(255, 0, 0)
	const colorOrange = combineRgb(255, 102, 0)
	const colorYellow = combineRgb(255, 255, 0)
	const colorGreen = combineRgb(0, 255, 0)
	//const colorPurple = combineRgb(255, 0, 255)
	//const colorActiveBlue = combineRgb(0, 51, 204)
	const colorBlue = combineRgb(0, 51, 204)
	const colorDarkRed = combineRgb(102, 0, 0)
	const colorDarkYellow = combineRgb(102, 102, 0)
	const colorDarkBlue = combineRgb(0, 0, 102)
	const colorDarkGreen = combineRgb(0, 102, 0)
	const colorGrey = combineRgb(51, 51, 51)
	const colorBlack = combineRgb(0, 0, 0)

	return presets
}
