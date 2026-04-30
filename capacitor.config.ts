import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.granacerta.app',
  appName: 'Granafiel',
  webDir: 'dist',
  server: {
    androidBuildPath: 'Granafiel-Android/Granafiel.apk'
  },
  resources: {
    android: {
      splash: 'resources/logo.png',
      launcherIcon: 'resources/logo.png'
    }
  }
};

export default config;