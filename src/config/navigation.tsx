import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Users,
  PieChart, TrendingUp, Activity, Star,
} from 'lucide-react'

export interface SubItem {
  label: string
  href?: string
}

export interface NavItem {
  label: string
  icon: React.ReactNode
  badge?: string
  subItems?: SubItem[]
}

export const navItems: NavItem[] = [
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

export const subIcons: Record<string, React.ReactNode> = {
  Overview:    <PieChart size={15} />,
  Performance: <TrendingUp size={15} />,
  Activity:    <Activity size={15} />,
  Favourites:  <Star size={15} />,
}
