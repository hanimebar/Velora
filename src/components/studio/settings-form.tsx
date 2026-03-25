'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import type { Studio } from '@/types/database'

const TIMEZONES = [
  { value: 'Europe/Stockholm', label: 'Stockholm (CET/CEST)' },
  { value: 'Europe/Oslo', label: 'Oslo (CET/CEST)' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen (CET/CEST)' },
  { value: 'Europe/Helsinki', label: 'Helsinki (EET/EEST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'UTC', label: 'UTC' },
]

interface SettingsFormProps {
  studio: Studio
}

export function SettingsForm({ studio }: SettingsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: studio.name,
    timezone: studio.timezone,
    description: studio.description ?? '',
    contact_email: studio.contact_email ?? '',
  })

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('studios')
      .update({
        name: form.name,
        timezone: form.timezone,
        description: form.description || null,
        contact_email: form.contact_email || null,
      })
      .eq('id', studio.id)

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Settings saved' })
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Studio identity */}
      <section>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>Studio identity</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-name">Studio name</Label>
            <Input id="s-name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </div>

          <div className="space-y-1.5">
            <Label>Booking page URL</Label>
            <div className="flex items-center gap-0">
              <div className="h-9 px-3 flex items-center text-sm rounded-l border border-r-0" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
                velora.actvli.com/book/
              </div>
              <Input value={studio.slug} disabled className="rounded-l-none opacity-60" />
            </div>
            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>The URL slug cannot be changed after creation.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-email">Contact email</Label>
            <Input
              id="s-email"
              type="email"
              value={form.contact_email}
              onChange={(e) => update('contact_email', e.target.value)}
              placeholder="hello@yourstudio.com"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-desc">About your studio</Label>
            <Textarea
              id="s-desc"
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </section>

      <hr />

      {/* Configuration */}
      <section>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-foreground)' }}>Configuration</h2>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => update('timezone', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Input value={studio.currency} disabled className="opacity-60" />
            <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
              Currency cannot be changed after setup. Contact support if needed.
            </p>
          </div>
        </div>
      </section>

      <hr />

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
