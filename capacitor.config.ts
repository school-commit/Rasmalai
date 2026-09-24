import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Keep the existing application id so this build can update the previous
  // Jyoti APK instead of becoming a separate Android app.
  appId: "com.aditya.jyoti",
  appName: "Rasmalai",
  webDir: "dist",
};

export default config;
