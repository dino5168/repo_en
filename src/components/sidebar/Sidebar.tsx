import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMenuStore } from '@/stores/menu.store'
import { SidebarSection } from './SidebarSection'
import { appConfig } from '@/config/app-config'

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { config } = useMenuStore()

  return (
    <div className="flex flex-col h-full px-4 py-6">

      {/* Logo row */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-[#2a7a4b]">
            <div className="w-4 h-4 rounded-full border-2 border-[#2a7a4b] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2a7a4b]" />
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-900 tracking-tight">{appConfig.appName}</span>
        </div>

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

      {/* Nav */}
      <nav className="flex flex-col gap-4">
        {config?.sections.map(section => (
          <SidebarSection key={section.key} section={section} />
        ))}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const { mobileOpen, setMobileOpen } = useMenuStore()

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900 lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 shadow-xl transition-transform duration-300 lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white border-r border-gray-100 shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
