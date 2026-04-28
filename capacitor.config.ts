import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.granacerta.app',
  appName: 'Granacerta',
  webDir: 'dist',
  server: {
    androidBuildPath: 'Granacerta-Mobile/app/build/outputs/apk/debug'
  },
  resources: {
    android: {
      splash: 'resources/logo.png',
      launcherIcon: 'resources/logo.png'
    }
  }
};

export default config;