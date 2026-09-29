import type { ReactNode } from 'react'
import { Network, GraduationCap } from 'lucide-react'

interface AppShellProps {
  children: ReactNode
  compact?: boolean
}

export function AppShell({ children, compact = false }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => (window.location.href = '/')}>
          <span className="brand-mark"><Network size={22} /></span>
          <span>
            <strong>SystemLab Live</strong>
            <small>Sistem Analizi ve Tasarımı</small>
          </span>
        </button>
        {!compact && (
          <div className="course-badge">
            <GraduationCap size={18} />
            Canlı sınıf
          </div>
        )}
      </header>
      <main className="page">{children}</main>
    </div>
  )
}
