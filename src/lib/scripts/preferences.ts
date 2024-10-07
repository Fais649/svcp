import { writeFile, readFile } from './filesystem';
import { themes, updateCSSVariables } from './theme';

export let preferences: Preferences = {
	theme: 'dark'
};

export interface Preferences {
	theme: string;
}

const preferencesFile = 'preferences.json';

export const savePreferences = async (preferences: Preferences) => {
	try {
		await writeFile('', preferencesFile, JSON.stringify(preferences));
		console.log(await readFile('', preferencesFile));
	} catch (error) {
		console.error('Error saving preferences:', error);
	}
};

export const loadPreferences = async (): Promise<void> => {
	try {
		const preferencesString = await readFile('', preferencesFile);
		const preferencesJson = JSON.parse(preferencesString);
		if (preferencesJson.theme) {
			updateCSSVariables(preferencesJson.theme);
		}
		preferences = preferencesJson as Preferences;
	} catch (error) {
		console.error('Error loading preferences:', error);
		preferences = { theme: 'light' } as Preferences;
	}
};

export function cycleTheme() {
	let index = themes.indexOf(preferences.theme);
	if (index === themes.length - 1) {
		index = 0;
		preferences.theme = themes[index];
	} else {
		preferences.theme = themes[index + 1];
	}

	console.log(preferences.theme);
	savePreferences(preferences);
	updateCSSVariables(preferences.theme);
}

