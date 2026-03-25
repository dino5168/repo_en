// Fallback 值：config.js 未載入時使用，應與 public/config.js 保持一致
const defaults: AppConfig = {
  appTitle: '十方資源科技-後臺管理',
  appName: 'Donezo',
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
