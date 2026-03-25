interface AppConfig {
  appTitle: string
  appName: string
  apiUrl: string
  menuConfigFile: string
  featureFlags: {
    darkMode: boolean
    betaFeatures: boolean
  }
}

interface Window {
  __APP_CONFIG__?: AppConfig
}
