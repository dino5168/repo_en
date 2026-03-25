const defaults: AppConfig = {
  appTitle: 'app',
  apiUrl: 'http://localhost:8000',
  menuConfigFile: 'menu.default.json',
  featureFlags: {
    darkMode: false,
    betaFeatures: false,
  },
}

function loadConfig(): AppConfig {
  const runtime = window.__APP_CONFIG__
  return {
    ...defaults,
    ...runtime,
    featureFlags: {
      ...defaults.featureFlags,
      ...runtime?.featureFlags,
    },
  }
}

export const appConfig = loadConfig()
