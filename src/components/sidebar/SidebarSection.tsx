import { cn } from '@/lib/utils'
import { SidebarItem } from './SidebarItem'
import type { MenuSection } from '@/config/menu'

interface SidebarSectionProps {
  section: MenuSection
}

export function SidebarSection({ section }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {section.title && (
        <p className={cn(
          'px-2 mb-1 text-xs font-medium tracking-widest text-gray-400 uppercase'
        )}>
          {section.title}
        </p>
      )}
      {section.items.map(item => (
        <SidebarItem key={item.key} item={item} />
      ))}
    </div>
  )
}
