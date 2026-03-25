'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Package,
  FileUp,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react'

const navItems = [
  { href: '/studio/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/studio/schedule', icon: Calendar, label: 'Schedule' },
  { href: '/studio/classes', icon: Layers, label: 'Class types' },
  { href: '/studio/members', icon: Users, label: 'Members' },
  { href: '/studio/products', icon: Package, label: 'Products' },
  { href: '/studio/import', icon: FileUp, label: 'Import' },
]

interface SidebarProps {
  studioName: string
}

export function StudioSidebar({ studioName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/studio/login')
  }

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r h-full" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)' }}>
      {/* Logo / studio name */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <span className="font-display text-lg font-medium" style={{ color: 'var(--color-foreground)' }}>
          Velora
        </span>
        {studioName && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-foreground-subtle)' }}>
            {studioName}
          </p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${active ? 'active' : ''}`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2 : 1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t space-y-0.5" style={{ borderColor: 'var(--color-border)' }}>
        <Link
          href="/studio/settings"
          className={`sidebar-item ${pathname === '/studio/settings' ? 'active' : ''}`}
        >
          <Settings className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          Settings
        </Link>
        <button
          onClick={handleSignOut}
          className="sidebar-item w-full text-left"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
