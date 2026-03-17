import type { CapacitorConfig } from '@capacitor/cli';

// You can override this at sync time:
// PowerShell example:
//   $env:CAP_SERVER_URL="https://tu-dominio.com"; npm run android:sync
//
// Default points to the Android emulator host (your PC localhost).
const serverUrl = process.env.CAP_SERVER_URL || 'http://10.0.2.2:3000';

const config: CapacitorConfig = {
  appId: 'com.grandchef.app',
  appName: 'GrandChef',
  webDir: 'dist',
  server: {
    url: serverUrl,
    cleartext: serverUrl.startsWith('http://')
  }
};

export default config;
