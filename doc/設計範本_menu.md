# Sidebar Menu 設計範本

> React + Vite + TailwindCSS + Zustand
> 架構：Build-time JSON 注入 + Runtime RBAC 過濾

---

## 架構概覽

```
src/config/menu/menu.{env}.json
        ↓  build time（vite define → __MENU_CONFIG__）
src/config/menu/index.ts  →  getFilteredMenuConfig(roles, permissions)
        ↓  runtime RBAC 過濾
src/stores/menu.store.ts  →  useMenuStore
        ↓
src/components/sidebar/
        Sidebar.tsx          ← mobile drawer + desktop aside
        SidebarSection.tsx   ← section title + item list
        SidebarItem.tsx      ← item button + submenu slide
```

---

## 專案結構

```
src/
├── config/
│   ├── menu/
│   │   ├── menu.schema.ts        # TypeScript 型別定義
│   │   ├── menu.default.json     # 預設 menu（開發 / 無 auth）
│   │   ├── menu.admin.json       # admin 角色 menu（可選）
│   │   └── index.ts              # 統一入口：rawMenuConfig + RBAC 過濾
│   └── icon-map.ts               # Lucide icon 靜態 map
├── stores/
│   └── menu.store.ts             # Zustand：config + UI 狀態
└── components/
    └── sidebar/
        ├── Sidebar.tsx           # 主元件（mobile + desktop）
        ├── SidebarSection.tsx    # Section 標題 + items 列表
        └── SidebarItem.tsx       # 單一 item + submenu 展開
```

---

## 1. 型別定義 — `menu.schema.ts`

```typescript
export type MenuItemType = 'link' | 'group' | 'divider'

export interface MenuItem {
  key: string
  type?: MenuItemType        // 預設 'link'
  label: string
  icon?: string              // Lucide icon 名稱字串（非 ReactNode）
  path?: string
  roles?: string[]           // 允許角色，空陣列 = 不限制
  permissions?: string[]     // 細粒度權限
  badge?: {
    text: string
    variant?: 'default' | 'destructive' | 'secondary'
  }
  disabled?: boolean
  hidden?: boolean
  children?: MenuItem[]      // 巢狀子選單
  meta?: Record<string, unknown>  // 擴充欄位
}

export interface MenuSection {
  key: string
  title?: string             // section 標題，選填
  items: MenuItem[]
}

export interface MenuConfig {
  version: string
  sections: MenuSection[]
}
```

---

## 2. JSON 設定檔 — `menu.default.json`

```json
{
  "version": "1.0.0",
  "sections": [
    {
      "key": "main",
      "items": [
        {
          "key": "dashboard",
          "label": "Dashboard",
          "icon": "LayoutDashboard",
          "children": [
            { "key": "overview",    "label": "Overview",    "icon": "PieChart",   "path": "/" },
            { "key": "performance", "label": "Performance", "icon": "TrendingUp", "path": "/performance" }
          ]
        },
        {
          "key": "tasks",
          "label": "Tasks",
          "icon": "CheckSquare",
          "path": "/tasks",
          "badge": { "text": "12+", "variant": "default" }
        },
        {
          "key": "users",
          "label": "Users",
          "icon": "Users",
          "path": "/users",
          "roles": ["admin", "manager"]
        }
      ]
    },
    {
      "key": "system",
      "title": "System",
      "items": [
        { "key": "settings", "label": "Settings", "icon": "Settings", "path": "/settings" }
      ]
    }
  ]
}
```

**注意事項：**
- `icon` 必須是 `icon-map.ts` 中已登錄的字串名稱
- `roles` 空陣列或不填 = 所有人可見
- `children` 支援無限巢狀，但建議最多兩層

---

## 3. Vite Build-time 注入 — `vite.config.ts`

```typescript
import { defineConfig, loadEnv } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const menuFile = env.VITE_MENU_CONFIG_FILE ?? 'menu.default.json'
  const menuPath = path.resolve(__dirname, `src/config/menu/${menuFile}`)
  const fallbackPath = path.resolve(__dirname, 'src/config/menu/menu.default.json')

  const menuConfig = JSON.parse(
    fs.readFileSync(fs.existsSync(menuPath) ? menuPath : fallbackPath, 'utf-8')
  )

  return {
    // ...其他設定
    define: {
      __MENU_CONFIG__: JSON.stringify(menuConfig),
    },
  }
})
```

### 環境變數設定

```env
# .env.development
VITE_MENU_CONFIG_FILE=menu.default.json

# .env.production
VITE_MENU_CONFIG_FILE=menu.admin.json
```

---

## 4. RBAC 過濾 — `config/menu/index.ts`

```typescript
declare const __MENU_CONFIG__: MenuConfig
export const rawMenuConfig: MenuConfig = __MENU_CONFIG__

export function getFilteredMenuConfig(
  userRoles: string[],
  userPermissions: string[]
): MenuConfig
```

過濾邏輯：
- `item.hidden === true` → 隱藏
- `item.roles` 不為空 → 用戶必須擁有其中一個 role
- `item.permissions` 不為空 → 用戶必須擁有**全部** permission
- parent 的所有 children 都被過濾掉時，parent 也不顯示

---

## 5. Icon Map — `config/icon-map.ts`

```typescript
// 必須明確列出所有使用的 icon，確保 tree-shaking 正常運作
const iconMap: Record<string, FC<LucideProps>> = {
  LayoutDashboard,
  CheckSquare,
  // ... 其他 icon
}

export function getIcon(name?: string): FC<LucideProps> | null {
  return name ? (iconMap[name] ?? null) : null
}
```

> 新增 JSON 中的 icon 名稱時，必須同步更新 `icon-map.ts`

---

## 6. Zustand Store — `stores/menu.store.ts`

```typescript
interface MenuState {
  config: MenuConfig | null
  activeKey: string          // 目前選中的主選單 key
  activeSubKey: string       // 目前選中的子選單 key
  openMenuKey: string | null // 目前展開的主選單 key
  mobileOpen: boolean

  initialize: (roles: string[], permissions: string[]) => void
  setActive: (key: string, subKey?: string) => void
  toggleMenu: (key: string) => void
  setMobileOpen: (v: boolean) => void
}
```

### App 初始化

```typescript
// src/App.tsx
const initialize = useMenuStore(s => s.initialize)

useEffect(() => {
  initialize(user?.roles ?? [], user?.permissions ?? [])
}, [user])
```

---

## 7. 元件層 — `components/sidebar/`

### Sidebar.tsx
- 負責 mobile drawer（slide-in）+ desktop `<aside>`
- 從 `useMenuStore` 讀取 `mobileOpen` / `setMobileOpen`
- 渲染 `SidebarSection` 列表

### SidebarSection.tsx
- 接收 `MenuSection`，顯示選填的 `title`
- 渲染該 section 下的 `SidebarItem` 列表

### SidebarItem.tsx
- 讀取 `useMenuStore`：activeKey / activeSubKey / openMenuKey
- 主按鈕：點擊呼叫 `toggleMenu` + `setActive`
- Submenu：CSS `grid-rows` transition 實現滑動展開/收合
- Active 視覺：左側綠色 bar（無 children 的葉節點）

---

## 設計決策

| 面向 | 決策 | 原因 |
|------|------|------|
| 設定載入時機 | Build-time（vite define） | 零 runtime fetch 開銷，bundle 內型別安全 |
| 過濾時機 | Runtime（RBAC） | roles / permissions 在 auth 後才確定 |
| 狀態管理 | Zustand | 輕量，無 Context re-render 問題 |
| Icon 策略 | 靜態 map 字串解析 | 保留 tree-shaking，JSON 不放 ReactNode |
| Submenu 動畫 | CSS `grid-rows` transition | 純 CSS，無需測量高度 |
| Section 概念 | 邏輯分群 | 支援 title、獨立過濾、可折疊 |
| `meta` 欄位 | 預留擴充 | 不改 schema 即可加自定義資料 |
| `version` 欄位 | 版本追蹤 | 供未來 cache busting / migration 使用 |

---

## 新增選單項目流程

1. 在 `menu.default.json`（或對應環境 JSON）加入新項目
2. 若使用新 icon，在 `src/config/icon-map.ts` 新增對應 import
3. 若需 RBAC 控制，在 item 設定 `roles` 或 `permissions`
4. 重新 `npm run dev`（vite define 會重新注入）

---

## 環境切換流程

```
開發環境
  .env.development → VITE_MENU_CONFIG_FILE=menu.default.json
  vite dev → __MENU_CONFIG__ = menu.default.json 內容

生產環境
  .env.production → VITE_MENU_CONFIG_FILE=menu.admin.json
  vite build → __MENU_CONFIG__ = menu.admin.json 內容

CI/CD 動態注入（進階）
  build 前替換 JSON 檔，或透過環境變數傳入完整 JSON
```
