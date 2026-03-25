import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { StudioShell } from '@/components/studio/studio-shell'
import { format } from 'date-fns'
import { Users, Search } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Members' }

export default async function MembersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/studio/login')

  const { data: studio } = await supabase
    .from('studios')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!studio) redirect('/studio/onboarding')

  const { data: clients } = await supabase
    .from('clients')
    .select('*, client_memberships(status, membership_id, memberships(name))')
    .eq('studio_id', studio.id)
    .order('created_at', { ascending: false })

  return (
    <StudioShell studioName={studio.name}>
      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-foreground)' }}>Members</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-foreground-muted)' }}>
              {clients?.length ?? 0} clients
            </p>
          </div>
        </div>

        {!clients || clients.length === 0 ? (
          <div className="text-center py-20 rounded-lg border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
            <Users className="h-10 w-10 mx-auto mb-4 opacity-25" strokeWidth={1} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-foreground-muted)' }}>No clients yet</p>
            <p className="text-sm mt-1">Clients will appear here after their first booking, or import from Mindbody.</p>
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
            <div className="border-b px-4 py-2.5" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5" style={{ color: 'var(--color-foreground-subtle)' }} />
                <input
                  type="search"
                  placeholder="Search clients..."
                  className="flex-1 text-sm bg-transparent outline-none placeholder:text-[var(--color-foreground-subtle)]"
                  style={{ color: 'var(--color-foreground)' }}
                />
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
              {/* Header row */}
              <div className="px-4 py-2 grid grid-cols-4 gap-4" style={{ backgroundColor: 'var(--color-surface)' }}>
                <span className="field-label">Name</span>
                <span className="field-label">Email</span>
                <span className="field-label">Membership</span>
                <span className="field-label">Joined</span>
              </div>
              {clients.map((client) => {
                const activeMembership = (client.client_memberships as Array<{
                  status: string
                  memberships: { name: string } | null
                }> | null)?.find((m) => m.status === 'active')

                return (
                  <div key={client.id} className="px-4 py-3 grid grid-cols-4 gap-4 border-t hover:bg-[var(--color-surface)] transition-velora" style={{ borderColor: 'var(--color-border)' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>
                        {client.first_name} {client.last_name}
                      </p>
                    </div>
                    <p className="text-sm truncate" style={{ color: 'var(--color-foreground-muted)' }}>{client.email}</p>
                    <div>
                      {activeMembership ? (
                        <span className="badge badge-active">{activeMembership.memberships?.name ?? 'Member'}</span>
                      ) : (
                        <span className="badge badge-neutral">No plan</span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                      {format(new Date(client.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </StudioShell>
  )
}
