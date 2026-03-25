# 專案範本：Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui

> **使用方式**：將此檔案交給 Claude Code，說「請依據這個範本建構專案」即可自動完成所有步驟。

---

## 技術棧

| 項目 | 版本／套件 |
|------|-----------|
| 建置工具 | Vite (latest) |
| 框架 | React 18 + TypeScript |
| 樣式 | Tailwind CSS v4 (`@tailwindcss/vite`) |
| UI 元件庫 | shadcn/ui (Radix 底層) |
| 狀態管理 | Zustand |
| 圖示 | lucide-react + @radix-ui/react-icons |

---

## 前置確認

```bash
node --version   # 需 v18 以上（建議 v20 LTS）
npm --version    # 需 v9 以上
```

---

## Step 1：建立 Vite 專案

> 目標目錄若已有其他檔案（如 CLAUDE.md），先建在子目錄再移出。

```bash
# 在目標目錄執行
npm create vite@latest app -- --template react-ts
# 將所有檔案移至當前目錄
mv app/* . && mv app/.gitignore . 2>/dev/null; rm -rf app/
npm install
```

---

## Step 2：安裝套件

依序執行以下四組安裝指令：

```bash
# Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# shadcn/ui 相關
npm install shadcn class-variance-authority clsx tailwind-merge lucide-react tw-animate-css

# 其他工具
npm install zustand @radix-ui/react-icons
npm install -D @types/node
```

---

## Step 3：修改 `vite.config.ts`

**完整替換**為以下內容：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

---

## Step 4：修改 `tsconfig.json`

**完整替換**為以下內容：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

---

## Step 5：修改 `tsconfig.app.json`

在 `compilerOptions` 最上方加入 `baseUrl` 與 `paths`（其餘保持不變）：

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "target": "ES2023",
    "useDefineForClassFields": true,
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

> **注意**：`baseUrl` 與 `paths` 必須同時加入 `tsconfig.json` 和 `tsconfig.app.json`，shadcn init 才能正確偵測到 import alias。

---

## Step 6：修改 `src/index.css`

**完整替換**為（只留這一行，其餘刪除）：

```css
@import "tailwindcss";
```

> shadcn init 後會自動追加 theme 變數與 dark mode 設定，不需手動處理。

---

## Step 7：初始化 shadcn/ui

```bash
npx shadcn@latest init -t vite --defaults
```

成功標誌：所有項目前出現 `✔`，並自動產生：
- `src/components/ui/button.tsx`
- `src/lib/utils.ts`
- 更新 `src/index.css`（自動加入 theme 變數）

---

## Step 8：修改 `src/App.tsx`（驗證用）

**完整替換**為以下內容以驗證 shadcn Button 正常運作：

```tsx
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button>Hello shadcn!</Button>
    </div>
  )
}

export default App
```

---

## Step 9：驗證建置

```bash
npm run build
```

成功標誌：輸出 `✓ built in xxxms`，無 TypeScript 錯誤。

啟動開發伺服器：

```bash
npm run dev
# 開啟 http://localhost:5173 確認畫面正常
```

---

## 常見錯誤排查

| 錯誤訊息 | 原因 | 解決方式 |
|----------|------|----------|
| `No import alias found in your tsconfig.json` | 只在 `tsconfig.app.json` 加了 alias | `tsconfig.json` 也必須加入 `baseUrl` 與 `paths` |
| `No Tailwind CSS configuration found` | vite.config.ts 未加 plugin | 確認 `tailwindcss()` 已加入 plugins 陣列 |
| `Cannot find module 'path'` | 缺少型別定義 | `npm install -D @types/node` |
| `shadcn init 失敗` | 未加 `-t vite` 旗標 | 使用 `npx shadcn@latest init -t vite --defaults` |
| `Operation cancelled`（Vite 建立時） | 目標目錄有既有檔案 | 先建在子目錄 `app/`，再 `mv app/* .` 移出 |
