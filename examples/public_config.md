# public/config.js 實作方式

> React + Vite  
> 設計模式：Runtime 設定注入，開發與正式環境行為完全一致

---

## 核心概念

`public/` 目錄下的檔案不經過 Vite 處理，直接複製到 `dist/`。  
`config.js` 在 React bundle 載入前執行，將設定掛載到 `window.__APP_CONFIG__`，  
任何環境只需替換這個檔案，不需要重新 build。

```
public/
  config.js          ← 開發環境設定（git 追蹤）
  config.staging.js  ← Staging 設定（git 追蹤）
  config.prod.js     ← 正式設定（git 追蹤）

dist/                ← vite build 產出
  config.js          ← 部署時替換為對應環境
  index.html
  assets/
```

---

## 1. config.js 檔案

```javascript
// public/config.js — 開發環境
window.__APP_CONFIG__ = {
  apiUrl: "http://localhost:3000",
  menuConfigFile: "menu.default.json",
  featureFlags: {
    darkMode: true,
    betaFeatures: false
  }
}
```

```javascript
// public/config.production.js — 正式環境
window.__APP_CONFIG__ = {
  apiUrl: "https://api.example.com",
  menuConfigFile: "menu.admin.json",
  featureFlags: {
    darkMode: true,
    betaFeatures: false
  }
}
```

---

## 2. index.html 載入順序

`config.js` 必須在 React bundle 之前載入：

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <!-- 必須在 React bundle 之前 -->
    <script src="/config.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 3. TypeScript 型別定義

```typescript
// src/types/app-config.d.ts
interface AppConfig {
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
```

---

## 4. 統一設定入口

```typescript
// src/config/app-config.ts
import type { AppConfig } from '@/types/app-config'

const defaults: AppConfig = {
  apiUrl: "http://localhost:3000",
  menuConfigFile: "menu.default.json",
  featureFlags: {
    darkMode: false,
    betaFeatures: false
  }
}

function loadConfig(): AppConfig {
  const runtime = window.__APP_CONFIG__ ?? {}
  return {
    ...defaults,
    ...runtime,
    featureFlags: {
      ...defaults.featureFlags,
      ...runtime.featureFlags
    }
  }
}

export const appConfig = loadConfig()
```

> **注意**：`featureFlags` 是巢狀物件，需要獨立展開合併，否則 `runtime` 的 `featureFlags` 會整個覆蓋 `defaults`。

---

## 5. 使用方式

整個 app 統一從 `appConfig` 讀取，不再有任何 `import.meta.env`：

```typescript
// API 呼叫
import { appConfig } from '@/config/app-config'

const res = await fetch(`${appConfig.apiUrl}/users`)
```

```typescript
// Menu 設定（搭配 vite define 方案）
import { appConfig } from '@/config/app-config'

const menuFile = appConfig.menuConfigFile
```

```typescript
// Feature Flag
import { appConfig } from '@/config/app-config'

if (appConfig.featureFlags.darkMode) {
  // ...
}
```

---

## 6. 搭配 Menu Config 使用

與 `config_menu.md` 的方案整合，`vite.config.ts` 改為從 `appConfig` 讀取 menu 檔：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(() => {
  // 開發時讀 public/config.js 取得 menuConfigFile
  // build time 仍需要知道要打包哪個 JSON
  // 透過環境變數或直接寫死 default
  const menuFile = process.env.MENU_CONFIG_FILE ?? 'menu.default.json'
  const menuPath = path.resolve(__dirname, `src/config/menu/${menuFile}`)

  const menuConfig = JSON.parse(
    fs.existsSync(menuPath)
      ? fs.readFileSync(menuPath, 'utf-8')
      : fs.readFileSync(
          path.resolve(__dirname, 'src/config/menu/menu.default.json'),
          'utf-8'
        )
  )

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') }
    },
    define: {
      __MENU_CONFIG__: JSON.stringify(menuConfig)
    }
  }
})
```

---

## 7. 部署流程

### Nginx

```bash
# 部署腳本 deploy.sh
#!/bin/bash
ENV=${1:-production}

npm run build

# 替換 config.js
cp public/config.${ENV}.js dist/config.js

# 複製到伺服器
rsync -avz dist/ user@server:/var/www/myapp/
```

```bash
./deploy.sh production
./deploy.sh staging
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 預設使用 production config
# 可在啟動時透過 volume 掛載覆蓋
COPY public/config.production.js /usr/share/nginx/html/config.js

EXPOSE 80
```

```bash
# 啟動時掛載不同 config
docker run -v $(pwd)/config.staging.js:/usr/share/nginx/html/config.js myapp
```

### Nginx 設定（SPA 必要）

```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # 禁止 config.js 快取，確保每次都讀最新版本
  location = /config.js {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
  }

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

> **重要**：`config.js` 設定 `no-cache`，避免瀏覽器快取導致設定更新後仍讀到舊值。

---

## 8. CI/CD 整合（GitHub Actions）

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build

      # 替換為正式環境 config
      - name: Inject production config
        run: cp public/config.production.js dist/config.js

      - name: Deploy to server
        run: rsync -avz dist/ ${{ secrets.DEPLOY_TARGET }}
```

---

## 與 .env 方案比較

| | `.env` 方案 | `public/config.js` 方案 |
|---|---|---|
| 開發 / 正式一致性 | 不同（讀取方式不同） | 完全一致 |
| 換環境需重新 build | 是 | 否 |
| 同一份 dist 多環境 | 不行 | 可以 |
| 設定更新方式 | 重新 build | 替換 config.js |
| 瀏覽器可見 | 是（內嵌在 JS） | 是（獨立 JS 檔） |
| 適合場景 | 小型專案 / 設定固定 | 多環境 / 需要彈性 |
