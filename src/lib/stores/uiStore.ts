// src/lib/stores/uiStore.ts
import { writable } from 'svelte/store';

interface UIState {
	keyboardHeight: number;
	boxHeight: number;
	boxWidth: number;
	headerHeight: string;
	headerFontSize: string;
	bigPhone: boolean;
	smolPhone: boolean;
}

const initialUIState: UIState = {
	keyboardHeight: 0,
	boxHeight: 300,
	boxWidth: 300,
	headerHeight: '25px',
	headerFontSize: '16px',
	bigPhone: true,
	smolPhone: false
};

const uiStore = writable<UIState>(initialUIState);

export const updateUIState = (newState: Partial<UIState>) => {
	uiStore.update(currentState => ({ ...currentState, ...newState }));
};

export default uiStore;

