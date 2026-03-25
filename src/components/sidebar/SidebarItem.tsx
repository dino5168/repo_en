import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getIcon } from '@/config/icon-map'
import { useMenuStore } from '@/stores/menu.store'
import type { MenuItem } from '@/config/menu'

interface SidebarItemProps {
  item: MenuItem
}

export function SidebarItem({ item }: SidebarItemProps) {
  const { activeKey, activeSubKey, openMenuKey, setActive, toggleMenu, setMobileOpen } =
    useMenuStore()

  const Icon = getIcon(item.icon)
  const isActive = activeKey === item.key
  const isOpen = openMenuKey === item.key
  const hasChildren = !!item.children?.length

  function handleClick() {
    if (hasChildren) {
      toggleMenu(item.key)
    }
    setActive(item.key)
  }

  function handleSubClick(child: MenuItem) {
    setActive(item.key, child.key)
    setMobileOpen(false)
  }

  return (
    <div>
      {/* Main button */}
      <button
        onClick={handleClick}
        disabled={item.disabled}
        className={cn(
          'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors w-full text-left',
          isActive
            ? 'text-gray-900 font-semibold'
            : 'text-gray-400 font-normal hover:text-gray-700 hover:bg-gray-50',
          item.disabled && 'pointer-events-none opacity-50'
        )}
      >
        {/* Active left indicator (leaf items only) */}
        {isActive && !hasChildren && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#2a7a4b]" />
        )}

        <span className={cn(isActive ? 'text-gray-900' : 'text-gray-400')}>
          {Icon && <Icon size={20} />}
        </span>

        <span className="flex-1">{item.label}</span>

        {/* Badge */}
        {item.badge && (
          <span className="flex items-center justify-center px-2 py-0.5 text-xs font-medium text-white bg-[#2a7a4b] rounded-full min-w-[2rem]">
            {item.badge.text}
          </span>
        )}

        {/* Chevron */}
        {hasChildren && (
          <ChevronDown
            size={15}
            className={cn(
              'text-gray-400 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        )}
      </button>

      {/* Submenu — animated slide */}
      {hasChildren && (
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-in-out',
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <div className="ml-9 mt-0.5 mb-1 flex flex-col gap-0.5 border-l-2 border-gray-100 pl-3">
              {item.children!.map((child) => {
                const ChildIcon = getIcon(child.icon)
                const isSubActive = activeSubKey === child.key
                return (
                  <button
                    key={child.key}
                    onClick={() => handleSubClick(child)}
                    className={cn(
                      'flex items-center gap-2 px-2 py-2 rounded-md text-xs transition-colors w-full text-left',
                      isSubActive
                        ? 'text-[#2a7a4b] font-semibold bg-[#2a7a4b]/8'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span className={cn(isSubActive ? 'text-[#2a7a4b]' : 'text-gray-300')}>
                      {ChildIcon && <ChildIcon size={15} />}
                    </span>
                    {child.label}
                    {isSubActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2a7a4b]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
