# 狀態管理文件（Zustand）

---

## 現況

**尚未建立任何 Zustand store。**

Zustand 套件已安裝（`package.json` 中的 `dependencies`），但 `src/stores/` 目錄尚未建立。

---

## 建議目錄結構

```
src/
└── stores/
    ├── useAppStore.ts      # 全域 UI 狀態（主題、語言、loading 等）
    ├── useAuthStore.ts     # 使用者驗證狀態（待需求確認）
    └── ...                 # 依業務模組新增
```

---

## Store 建立範本

以下為 Zustand store 的標準寫法（TypeScript strict 相容）：

```typescript
// src/stores/useAppStore.ts
import { create } from 'zustand'

interface AppState {
  // State
  theme: 'light' | 'dark'
  isLoading: boolean

  // Actions
  setTheme: (theme: 'light' | 'dark') => void
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  // 初始值
  theme: 'light',
  isLoading: false,

  // Actions
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
}))
```

---

## Store 使用方式

```tsx
// 在元件中使用
import { useAppStore } from '@/stores/useAppStore'

function MyComponent() {
  // 訂閱單一 state（避免不必要重渲染）
  const theme = useAppStore((state) => state.theme)
  const setTheme = useAppStore((state) => state.setTheme)

  return (
    <button onClick={() => setTheme('dark')}>
      切換為深色模式
    </button>
  )
}
```

---

## Store 間依賴關係

**尚未建立，故無依賴關係。**

> 後續建立 store 後，請在此補充各 store 的 state shape、actions 清單，以及 store 之間是否有跨 store 訂閱（使用 `getState()` 方式呼叫）。
