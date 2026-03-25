# Dashboard Menu 環境設定設計

> React + TailwindCSS + shadcn/ui  
> 設計模式：Build-time JSON 注入 + Runtime RBAC 過濾

---

## 架構概覽

```
menu.{env}.json
      ↓ (build time, vite define)
__MENU_CONFIG__
      ↓
getFilteredMenuConfig(roles, permissions)   ← runtime RBAC
      ↓
useMenuStore.config
      ↓
Sidebar → SidebarSection → SidebarItem
```

---

## 專案結構

```
src/
├── config/
│   ├── menu/
│   │   ├── menu.schema.ts        # TypeScript 型別定義
│   │   ├── menu.default.json     # 預設 menu
│   │   ├── menu.admin.json       # admin 角色 menu
│   │   └── index.ts              # 統一入口（RBAC 過濾）
│   └── icon-map.ts               # Lucide icon 動態 map
├── stores/
│   └── menu.store.ts             # Zustand store
├── components/
│   └── sidebar/
│       ├── Sidebar.tsx
│       ├── SidebarSection.tsx
│       └── SidebarItem.tsx
└── vite.config.ts
```

---

## 1. 型別定義

```typescript
// src/config/menu/menu.schema.ts
export type MenuItemType = 'link' | 'group' | 'divider'

export interface MenuItem {
  key: string
  type?: MenuItemType        // 預設 'link'
  label: string
  icon?: string
  path?: string
  roles?: string[]
  permissions?: string[]     // 細粒度權限
  badge?: {
    text: string
    variant?: 'default' | 'destructive' | 'secondary'
  }
  disabled?: boolean
  hidden?: boolean
  children?: MenuItem[]
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

## 2. JSON 設定檔

```json
// src/config/menu/menu.default.json
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
          "path": "/"
        },
        {
          "key": "analytics",
          "label": "Analytics",
          "icon": "BarChart2",
          "path": "/analytics",
          "badge": { "text": "New", "variant": "default" }
        }
      ]
    },
    {
      "key": "management",
      "title": "Management",
      "items": [
        {
          "key": "users",
          "label": "Users",
          "icon": "Users",
          "path": "/users",
          "roles": ["admin", "manager"],
          "children": [
            { "key": "users-list",   "label": "All Users", "path": "/users" },
            { "key": "users-invite", "label": "Invite",    "path": "/users/invite" }
          ]
        },
        {
          "key": "reports",
          "label": "Reports",
          "icon": "FileText",
          "path": "/reports",
          "permissions": ["reports:read"]
        }
      ]
    },
    {
      "key": "system",
      "title": "System",
      "items": [
        {
          "key": "settings",
          "label": "Settings",
          "icon": "Settings",
          "path": "/settings"
        }
      ]
    }
  ]
}
```

---

## 3. Vite 設定注入

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  // 依環境選擇 menu 檔，預設 fallback 到 default
  const menuFile = env.VITE_MENU_CONFIG_FILE ?? 'menu.default.json'
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

### 環境變數設定

```env
# .env.development
VITE_MENU_CONFIG_FILE=menu.default.json

# .env.production
VITE_MENU_CONFIG_FILE=menu.admin.json
```

---

## 4. 統一入口 + RBAC 過濾

```typescript
// src/config/menu/index.ts
import type { MenuConfig, MenuItem, MenuSection } from './menu.schema'

declare const __MENU_CONFIG__: MenuConfig

export const rawMenuConfig: MenuConfig = __MENU_CONFIG__

function filterItem(
  item: MenuItem,
  userRoles: string[],
  userPermissions: string[]
): MenuItem | null {
  if (item.hidden) return null

  const passRole =
    !item.roles?.length ||
    item.roles.some(r => userRoles.includes(r))

  const passPermission =
    !item.permissions?.length ||
    item.permissions.every(p => userPermissions.includes(p))

  if (!passRole || !passPermission) return null

  if (item.children?.length) {
    const filteredChildren = item.children
      .map(child => filterItem(child, userRoles, userPermissions))
      .filter((c): c is MenuItem => c !== null)

    // 子項全被過濾掉，parent 也不顯示
    if (!filteredChildren.length) return null
    return { ...item, children: filteredChildren }
  }

  return item
}

export function getFilteredMenuConfig(
  userRoles: string[],
  userPermissions: string[]
): MenuConfig {
  const sections: MenuSection[] = rawMenuConfig.sections
    .map(section => ({
      ...section,
      items: section.items
        .map(item => filterItem(item, userRoles, userPermissions))
        .filter((i): i is MenuItem => i !== null),
    }))
    .filter(section => section.items.length > 0)

  return { ...rawMenuConfig, sections }
}
```

---

## 5. Icon 動態 Map

```typescript
// src/config/icon-map.ts
import {
  LayoutDashboard, BarChart2, Settings, Users, FileText,
  User, Shield, type LucideProps
} from 'lucide-react'
import type { FC } from 'react'

const iconMap: Record<string, FC<LucideProps>> = {
  LayoutDashboard,
  BarChart2,
  Settings,
  Users,
  FileText,
  User,
  Shield,
}

export function getIcon(name?: string): FC<LucideProps> | null {
  return name ? (iconMap[name] ?? null) : null
}
```

> **注意**：`iconMap` 必須明確列出所有使用的 icon，避免 tree-shaking 失效導致 bundle 膨脹。

---

## 6. Zustand Store

```typescript
// src/stores/menu.store.ts
import { create } from 'zustand'
import { getFilteredMenuConfig } from '@/config/menu'
import type { MenuConfig } from '@/config/menu/menu.schema'

interface MenuState {
  config: MenuConfig | null
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  initialize: (roles: string[], permissions: string[]) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  config: null,
  collapsed: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  initialize: (roles, permissions) =>
    set({ config: getFilteredMenuConfig(roles, permissions) }),
}))
```

### 在 App 初始化

```typescript
// src/App.tsx
const { user } = useAuthStore()
const initialize = useMenuStore(s => s.initialize)

useEffect(() => {
  if (user) {
    initialize(user.roles, user.permissions)
  }
}, [user])
```

---

## 7. Sidebar 元件

```tsx
// src/components/sidebar/Sidebar.tsx
import { useMenuStore } from '@/stores/menu.store'
import { SidebarSection } from './SidebarSection'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { config, collapsed } = useMenuStore()

  if (!config) return null

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-200',
        collapsed ? 'w-14' : 'w-56'
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <span className="text-sm font-semibold tracking-tight">My App</span>
        )}
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {config.sections.map(section => (
          <SidebarSection key={section.key} section={section} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  )
}
```

```tsx
// src/components/sidebar/SidebarSection.tsx
import { NavLink } from 'react-router-dom'
import { getIcon } from '@/config/icon-map'
import { cn } from '@/lib/utils'
import type { MenuSection, MenuItem } from '@/config/menu/menu.schema'
import { Badge } from '@/components/ui/badge'

interface SectionProps {
  section: MenuSection
  collapsed: boolean
}

export function SidebarSection({ section, collapsed }: SectionProps) {
  return (
    <div className="space-y-1">
      {section.title && !collapsed && (
        <p className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {section.title}
        </p>
      )}
      {section.items.map(item => (
        <SidebarItem key={item.key} item={item} collapsed={collapsed} />
      ))}
    </div>
  )
}

interface ItemProps {
  item: MenuItem
  collapsed: boolean
  depth?: number
}

function SidebarItem({ item, collapsed, depth = 0 }: ItemProps) {
  const Icon = getIcon(item.icon)

  return (
    <div>
      <NavLink
        to={item.path ?? '#'}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isActive && 'bg-accent text-accent-foreground font-medium',
            item.disabled && 'pointer-events-none opacity-50',
            depth > 0 && 'ml-3'
          )
        }
      >
        {Icon && <Icon className="h-4 w-4 shrink-0" />}
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <Badge
                variant={item.badge.variant ?? 'default'}
                className="text-[10px] px-1.5"
              >
                {item.badge.text}
              </Badge>
            )}
          </>
        )}
      </NavLink>

      {!collapsed && item.children?.map(child => (
        <SidebarItem key={child.key} item={child} collapsed={collapsed} depth={depth + 1} />
      ))}
    </div>
  )
}
```

---

## 設計決策說明

| 面向 | 決策 | 原因 |
|------|------|------|
| 設定載入時機 | Build-time（vite define） | 零 runtime fetch 開銷，型別安全 |
| 過濾時機 | Runtime（RBAC） | 角色/權限在 auth 後才知道 |
| 狀態管理 | Zustand | 輕量，避免 Context re-render |
| Icon 策略 | 靜態 map | 保留 tree-shaking，避免動態 import 複雜度 |
| Section 概念 | 邏輯分群 | 支援 title 顯示、獨立過濾 |
| `meta` 欄位 | 預留擴充 | 不改 schema 就能加自定義資料 |
| `version` 欄位 | 版本追蹤 | 未來 cache busting / migration 用 |

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
  build script 在 build 前替換 JSON 檔
  或透過環境變數傳入完整 JSON（URL encoded）
```
