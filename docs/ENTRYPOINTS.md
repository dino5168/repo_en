# 系統進入點文件

---

## Bootstrap 流程：main.tsx → App.tsx

```
index.html
  └─ <script src="/src/main.tsx">
       └─ createRoot(document.getElementById('root')!)
            └─ <StrictMode>
                 └─ <App />
```

### main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'          // 載入 Tailwind + shadcn theme
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `StrictMode`：開發環境雙重渲染，協助偵測副作用問題
- `index.css`：全域注入 Tailwind v4 + shadcn CSS 變數（`--background`, `--primary` 等）
- `#root`：`index.html` 中唯一掛載點

### App.tsx（目前為驗證用版本）

```tsx
import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button>Hello shadcn!</Button>
    </div>
  )
}
```

---

## Routing 結構

**尚未建立。**

目前未安裝 `react-router-dom` 或其他 routing 套件。建議後續建立方式：

```bash
npm install react-router-dom
```

建議目錄結構：

```
src/
├── App.tsx          # 定義 <RouterProvider> 或 <BrowserRouter>
└── pages/
    ├── HomePage.tsx
    ├── AboutPage.tsx
    └── ...
```

---

## 各 Page / View 進入路徑

**尚未建立。**

| 路徑 | 元件 | 說明 |
|------|------|------|
| `/` | `HomePage` | 首頁（待建立） |

> 待加入 react-router 後補充完整路由表。
