import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
	appId: 'com.wispr.app',
	appName: 'wisp_r',
	webDir: 'build',
	plugins: {
		Keyboard: {
			resize: KeyboardResize.None,
			style: KeyboardStyle.Dark
		},
		SafeArea: {
			enabled: true,
			customColorsForSystemBars: true,
			statusBarColor: '#000000',
			statusBarContent: 'dark',
			navigationBarColor: '#000000',
			navigationBarContent: 'dark',
			offset: 0,
		},
	},
};

export default config;
