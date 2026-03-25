# 專案安裝步驟：Vite + React + TypeScript + Electron + Tailwind v4 + shadcn/ui

## 前置確認

```bash
node --version   # 需 v18.0.0 以上（建議 v20 LTS）
npm --version    # 需 v9.0.0 以上
git --version    # 需 v2.x 以上
```

---

## Step 1：建立 Vite 專案

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

> `my-app` 可替換成你的專案名稱。

---

## Step 2：安裝 Electron 相關套件

```bash
npm install electron --save-dev
npm install electron-builder --save-dev
npm install vite-plugin-electron --save-dev
npm install electron-is-dev
```

---

## Step 3：安裝 Tailwind CSS v4

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## Step 4：安裝 shadcn/ui 及 UI 工具套件

```bash
npm install shadcn class-variance-authority clsx tailwind-merge lucide-react tw-animate-css
```

---

## Step 5：安裝其他工具套件

```bash
npm install zustand
npm install @radix-ui/react-icons
npm install -D @types/node
```

---

## Step 6：修改 `vite.config.ts`

將檔案內容**完整替換**為：

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

## Step 7：修改 `src/index.css`

將檔案內容**完整替換**為（刪除所有原有內容，只保留這一行）：

```css
@import "tailwindcss";
```

---

## Step 8：修改 `tsconfig.json`

在 `compilerOptions` 內加入 `baseUrl` 與 `paths`：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

> 其餘原有設定保持不變，只新增這兩個欄位。

---

## Step 9：初始化 shadcn/ui

```bash
npx shadcn@latest init -t vite
```

互動式問答選項：

| 問題 | 選擇 |
|------|------|
| Select a component library | Radix |
| Which preset would you like to use? | Nova（或依個人喜好） |

成功標誌：看到所有項目前面出現 `√` 打勾符號。

---

## Step 10：新增第一個元件（驗證用）

```bash
npx shadcn@latest add button
```

---

## Step 11：驗證安裝

```bash
npm run dev
```

瀏覽器開啟 `http://localhost:5173`，確認頁面正常顯示。

修改 `src/App.tsx` 測試 shadcn Button：

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

## 常見錯誤排查

| 錯誤訊息 | 解決方式 |
|----------|----------|
| `No Tailwind CSS configuration found` | 確認 `vite.config.ts` 已加入 `tailwindcss()` plugin，且 `index.css` 已改為 `@import "tailwindcss"` |
| `No import alias found in your tsconfig.json` | 確認 `tsconfig.json` 已加入 `baseUrl` 與 `paths` 設定 |
| `Cannot find module 'path'` | 執行 `npm install -D @types/node` |
| `shadcn init 仍然失敗` | 確認使用 `npx shadcn@latest init -t vite`（必須加上 `-t vite` 旗標） |
| `Tailwind class 無效果` | 確認 `index.css` 已被 `main.tsx` 匯入，且只有一行 `@import "tailwindcss"` |
