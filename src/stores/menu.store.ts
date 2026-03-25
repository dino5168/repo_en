import { create } from 'zustand'
import { getFilteredMenuConfig } from '@/config/menu'
import type { MenuConfig } from '@/config/menu'

interface MenuState {
  config: MenuConfig | null
  activeKey: string
  activeSubKey: string
  openMenuKey: string | null
  mobileOpen: boolean

  initialize: (roles: string[], permissions: string[]) => void
  setActive: (key: string, subKey?: string) => void
  toggleMenu: (key: string) => void
  setMobileOpen: (v: boolean) => void
}

export const useMenuStore = create<MenuState>((set, get) => ({
  config: null,
  activeKey: 'dashboard',
  activeSubKey: 'overview',
  openMenuKey: 'dashboard',
  mobileOpen: false,

  initialize: (roles, permissions) =>
    set({ config: getFilteredMenuConfig(roles, permissions) }),

  setActive: (key, subKey) =>
    set({ activeKey: key, ...(subKey ? { activeSubKey: subKey } : {}) }),

  toggleMenu: (key) =>
    set({ openMenuKey: get().openMenuKey === key ? null : key }),

  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
}))
