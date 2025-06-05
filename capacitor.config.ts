
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2ecafb51496849dba86ad1f7700e083f',
  appName: 'biz-track-inventory-mobile',
  webDir: 'dist',
  server: {
    url: 'https://2ecafb51-4968-49db-a86a-d1f7700e083f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f8fafc',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#3b82f6'
    }
  }
};

export default config;
