interface AppConfig {
  appTitle: string
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
