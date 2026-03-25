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

export type { MenuConfig, MenuItem, MenuSection }
