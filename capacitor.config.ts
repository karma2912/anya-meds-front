import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anyameds.app',
  appName: 'Anya Meds',
  webDir: 'out', // <-- THIS IS THE IMPORTANT CHANGE
  server: {
    androidScheme: 'https'
  }
};

export default config;