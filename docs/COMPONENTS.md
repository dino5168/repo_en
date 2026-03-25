# 元件文件

---

## src/components 元件清單

### UI 元件（shadcn/ui）：`src/components/ui/`

| 元件 | 檔案 | 來源 |
|------|------|------|
| `Button` | `ui/button.tsx` | `npx shadcn@latest add button` |

> 其餘 shadcn 元件可依需求透過 `npx shadcn@latest add <component>` 新增。

### 自定義業務元件：`src/components/`

**尚未建立。**

---

## 元件詳細說明

### `Button`

**檔案**：`src/components/ui/button.tsx`

**用途**：通用按鈕元件，封裝 Base UI 的 `ButtonPrimitive` 並加上 Tailwind variant 系統。

**Props Interface**：

```typescript
// 繼承自 ButtonPrimitive.Props（@base-ui/react/button）+ variant props
{
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'link'
  size?:    'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
  className?: string
  // 以及所有原生 button HTML 屬性（children, onClick, disabled, ...）
}
```

**Variant 說明**：

| variant | 外觀 |
|---------|------|
| `default` | 深色背景主按鈕 |
| `outline` | 邊框樣式，透明底 |
| `secondary` | 次要動作，淺灰底 |
| `ghost` | 無邊框，hover 才顯示底色 |
| `destructive` | 危險操作，紅色系 |
| `link` | 文字連結樣式，含底線 |

**Size 說明**：

| size | 高度 | 用途 |
|------|------|------|
| `default` | h-8 | 一般用途 |
| `sm` | h-7 | 較小空間 |
| `xs` | h-6 | 極小空間 |
| `lg` | h-9 | 較大強調 |
| `icon` | 8×8 | 只有圖示，無文字 |
| `icon-sm` | 7×7 | 小圖示按鈕 |
| `icon-xs` | 6×6 | 極小圖示 |
| `icon-lg` | 9×9 | 大圖示 |

**使用範例**：

```tsx
import { Button } from '@/components/ui/button'

// 基本用法
<Button>送出</Button>

// 指定 variant 與 size
<Button variant="outline" size="sm">取消</Button>

// 危險操作
<Button variant="destructive">刪除</Button>

// 圖示按鈕
import { Trash2 } from 'lucide-react'
<Button variant="ghost" size="icon"><Trash2 /></Button>
```

---

## shadcn/ui 已安裝元件

| 元件 | 指令 |
|------|------|
| Button | `npx shadcn@latest add button` ✅ |

## 常用 shadcn/ui 元件（待新增）

```bash
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add form
npx shadcn@latest add table
npx shadcn@latest add select
npx shadcn@latest add toast
```

---

## 工具函式

### `cn()`

**檔案**：`src/lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**用途**：合併 Tailwind class，自動解決衝突（如 `p-2` 與 `p-4` 同時傳入時，後者覆蓋前者）。

**使用範例**：

```tsx
// 基本合併
cn('px-4 py-2', 'bg-blue-500')
// → 'px-4 py-2 bg-blue-500'

// 條件 class
cn('base-class', isActive && 'active-class', isDisabled && 'opacity-50')

// 衝突解決（tailwind-merge）
cn('p-2 p-4')
// → 'p-4'（後者優先）
```
