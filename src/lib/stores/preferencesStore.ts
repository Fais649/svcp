import { writable } from 'svelte/store';
import type { Preferences } from '$lib/types';
import { loadPreferences, savePreferences } from '$lib/scripts/preferences';

const initialPreferences: Preferences = {
	theme: 'light'
};

const preferencesStore = writable<Preferences>(initialPreferences);

export const initializePreferences = async () => {
	const prefs = await loadPreferences();
	preferencesStore.set(prefs);
};

export const cycleTheme = (themes: string[]) => {
	preferencesStore.update(currentPrefs => {
		let index = themes.indexOf(currentPrefs.theme);
		if (index === themes.length - 1) {
			index = 0;
		} else {
			index += 1;
		}
		const newTheme = themes[index];
		const updatedPrefs = { ...currentPrefs, theme: newTheme };
		savePreferences(updatedPrefs);
		return updatedPrefs;
	});
};

export default preferencesStore;
