import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fluxofinan.app',
  appName: 'FluxoFinan',
  webDir: 'dist',
  server: {
    androidBuildPath: 'FluxoFinan-Mobile/app/build/outputs/apk/debug'
  }
};

export default config;
