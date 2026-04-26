import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fluxofinan.app',
  appName: 'FluxoFinan',
  webDir: 'dist',
  server: {
    androidBuildPath: 'FluxoFinan-Mobile/app/build/outputs/apk/debug'
  },
  resources: {
    android: {
      splash: 'resources/logo.png',
      launcherIcon: 'resources/logo.png'
    }
  }
};

export default config;