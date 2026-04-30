import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.granacerta.app',
  appName: 'Granafiel',
  webDir: 'dist',
  server: {
    androidBuildPath: 'Granafiel-Android/Granafiel.0.0.1-debug.apk'
  resources: {
    android: {
      splash: 'resources/logo.png',
      launcherIcon: 'resources/logo.png'
    }
  }
};

export default config;