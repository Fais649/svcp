import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize, KeyboardStyle } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'punk.sys.svcp.app',
  appName: 'svcp',
  webDir: 'build',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true
    }
  },
  server: {
    // for android only, below settings will work out of the box
    // for iOS or both, change the url to http://your-device-ip 
    // To discover your workstation IP, just run ifconfig
    "url": "http://192.168.1.248:5174",
    "cleartext": true
  }
};

export default config;
