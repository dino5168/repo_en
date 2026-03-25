export type MenuItemType = 'link' | 'group' | 'divider'

export interface MenuItem {
  key: string
  type?: MenuItemType        // 預設 'link'
  label: string
  icon?: string              // Lucide icon 名稱字串
  path?: string
  roles?: string[]
  permissions?: string[]
  badge?: {
    text: string
    variant?: 'default' | 'destructive' | 'secondary'
  }
  disabled?: boolean
  hidden?: boolean
  children?: MenuItem[]
  meta?: Record<string, unknown>
}

export interface MenuSection {
  key: string
  title?: string
  items: MenuItem[]
}

export interface MenuConfig {
  version: string
  sections: MenuSection[]
}
