# 專案架構文件

> 最後更新：依據 src/ 實際掃描產出，非假設內容。

---

## 專案目錄結構

```
repo_en/
├── src/
│   ├── main.tsx                  # 應用程式進入點
│   ├── App.tsx                   # 根元件
│   ├── index.css                 # 全域樣式（Tailwind + shadcn theme）
│   ├── App.css                   # App 層級樣式
│   ├── assets/                   # 靜態資源
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   └── ui/                   # shadcn/ui 元件
│   │       └── button.tsx
│   └── lib/
│       └── utils.ts              # 工具函式
├── docs/                         # 技術文件（本目錄）
├── doc/                          # 設定與範本文件
├── public/                       # Vite 靜態資源
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── package.json
```

---

## 技術棧

| 層級 | 技術 | 說明 |
|------|------|------|
| 建置工具 | Vite (latest) | HMR + ESBuild 加速 |
| 框架 | React 18 + TypeScript | Strict mode 啟用 |
| 樣式 | Tailwind CSS v4 | `@tailwindcss/vite` plugin 驅動 |
| UI 元件 | shadcn/ui + Base UI | Radix 無障礙底層 |
| 樣式工具 | clsx + tailwind-merge | 條件 class 合併 |
| Variant 系統 | class-variance-authority | 元件 variant 定義 |
| 圖示 | lucide-react + @radix-ui/react-icons | 已安裝，尚未使用 |
| 狀態管理 | Zustand | 已安裝，尚未建立 store |
| 型別 | TypeScript strict | `noUnusedLocals`, `noUncheckedSideEffectImports` |

---

## 模組職責說明

| 模組路徑 | 職責 | 現況 |
|----------|------|------|
| `src/main.tsx` | 掛載 React app 至 DOM `#root` | 已建立 |
| `src/App.tsx` | 根路由元件，定義最外層佈局 | 已建立（驗證用） |
| `src/components/ui/` | shadcn/ui 通用元件庫 | 已有 Button |
| `src/lib/utils.ts` | `cn()` 等跨元件共用工具函式 | 已建立 |
| `src/components/` (非 ui) | 專案自定義業務元件 | **尚未建立** |
| `src/pages/` 或 `src/views/` | 頁面級元件 | **尚未建立** |
| `src/hooks/` | 自定義 React hooks | **尚未建立** |
| `src/stores/` | Zustand 全域狀態 store | **尚未建立** |
| `src/types/` | 共用 TypeScript 型別定義 | **尚未建立** |

---

## 資料流說明

目前專案為初始狀態，資料流極簡：

```
main.tsx
  └─ 掛載 <App />
       └─ 渲染 <Button>（純 UI，無狀態）
```

**預期建立後的資料流（Zustand 模式）**：

```
Zustand Store (src/stores/*.ts)
  └─ useXxxStore() hook
       └─ Page Component (src/pages/)
            └─ UI Component (src/components/)
                 └─ shadcn/ui 元件 (src/components/ui/)
```

- Store 為單向資料來源（Single Source of Truth）
- Component 透過 `useXxxStore()` 訂閱 state，不直接操作 store 外部
- Action 在 store 內定義，component 呼叫 action 觸發狀態變更
