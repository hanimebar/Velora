import { StudioSidebar } from './sidebar'

interface StudioShellProps {
  studioName: string
  children: React.ReactNode
}

export function StudioShell({ studioName, children }: StudioShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-background)' }}>
      <StudioSidebar studioName={studioName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
