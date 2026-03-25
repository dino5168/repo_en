import { useState } from 'react'
import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Users,
  ChevronDown, Menu, X,
  PieChart, TrendingUp, Activity, Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubItem {
  label: string
  href?: string
}

interface NavItem {
  label: string
  icon: React.ReactNode
  badge?: string
  subItems?: SubItem[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: <LayoutDashboard size={20} />,
    subItems: [
      { label: 'Overview' },
      { label: 'Performance' },
      { label: 'Activity' },
      { label: 'Favourites' },
    ],
  },
  { label: 'Tasks',     icon: <CheckSquare size={20} />, badge: '12+' },
  { label: 'Calendar',  icon: <Calendar size={20} /> },
  { label: 'Analytics', icon: <BarChart2 size={20} /> },
  { label: 'Team',      icon: <Users size={20} /> },
]

const subIcons: Record<string, React.ReactNode> = {
  Overview:    <PieChart size={15} />,
  Performance: <TrendingUp size={15} />,
  Activity:    <Activity size={15} />,
  Favourites:  <Star size={15} />,
}

// ── Sidebar content (shared between mobile & desktop) ──────────────────────
interface SidebarContentProps {
  onClose?: () => void
}

function SidebarContent({ onClose }: SidebarContentProps) {
  const [active, setActive]       = useState('Dashboard')
  const [activeSub, setActiveSub] = useState('Overview')
  const [openMenu, setOpenMenu]   = useState<string | null>('Dashboard')

  function handleNavClick(item: NavItem) {
    if (item.subItems) {
      setOpenMenu(openMenu === item.label ? null : item.label)
    }
    setActive(item.label)
  }

  function handleSubClick(sub: SubItem) {
    setActiveSub(sub.label)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full px-4 py-6">

      {/* Logo row */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-3">
          {/* Donezo target icon */}
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#2a7a4b]">
            <div className="w-4 h-4 rounded-full border-2 border-[#2a7a4b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2a7a4b]" />
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">Donezo</span>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Menu label */}
      <p className="px-2 mb-2 text-xs font-medium tracking-widest text-gray-400 uppercase">
        Menu
      </p>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => {
          const isActive  = active === item.label
          const isOpen    = openMenu === item.label
          const hasSubItems = !!item.subItems

          return (
            <div key={item.label}>
              {/* Main nav button */}
              <button
                onClick={() => handleNavClick(item)}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left',
                  isActive
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-400 font-normal hover:text-gray-700 hover:bg-gray-50'
                )}
              >
                {/* Active left indicator */}
                {isActive && !isOpen && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#2a7a4b]" />
                )}

                <span className={cn(isActive ? 'text-gray-900' : 'text-gray-400')}>
                  {item.icon}
                </span>

                <span className="flex-1">{item.label}</span>

                {/* Badge */}
                {item.badge && (
                  <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-[#2a7a4b] rounded-full min-w-[2rem]">
                    {item.badge}
                  </span>
                )}

                {/* Chevron for items with submenus */}
                {hasSubItems && (
                  <ChevronDown
                    size={15}
                    className={cn(
                      'text-gray-400 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                )}
              </button>

              {/* SubMenu */}
              {hasSubItems && isOpen && (
                <div className="ml-9 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-3">
                  {item.subItems!.map((sub) => {
                    const isSubActive = activeSub === sub.label
                    return (
                      <button
                        key={sub.label}
                        onClick={() => handleSubClick(sub)}
                        className={cn(
                          'flex items-center gap-2 px-2 py-2 rounded-md text-xs transition-colors w-full text-left',
                          isSubActive
                            ? 'text-[#2a7a4b] font-semibold bg-[#2a7a4b]/8'
                            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        <span className={cn(isSubActive ? 'text-[#2a7a4b]' : 'text-gray-300')}>
                          {subIcons[sub.label]}
                        </span>
                        {sub.label}
                        {isSubActive && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2a7a4b]" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

// ── Main Sidebar export ─────────────────────────────────────────────────────
export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
