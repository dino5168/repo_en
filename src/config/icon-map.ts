import {
  LayoutDashboard, CheckSquare, Calendar, BarChart2, Users,
  PieChart, TrendingUp, Activity, Star,
  Settings, FileText, Shield, User,
  type LucideProps,
} from 'lucide-react'
import type { FC } from 'react'

const iconMap: Record<string, FC<LucideProps>> = {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart2,
  Users,
  PieChart,
  TrendingUp,
  Activity,
  Star,
  Settings,
  FileText,
  Shield,
  User,
}

export function getIcon(name?: string): FC<LucideProps> | null {
  return name ? (iconMap[name] ?? null) : null
}
