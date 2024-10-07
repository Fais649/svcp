import { writable } from 'svelte/store';

interface DeviceInfo {
	os: string;
	viewportHeightPx: number;
}

const deviceStore = writable<DeviceInfo>({
	os: '',
	viewportHeightPx: -1
});

export const setDeviceInfo = (os: string, viewportHeightPx: number) => {
	deviceStore.set({ os, viewportHeightPx });
};

export default deviceStore;
