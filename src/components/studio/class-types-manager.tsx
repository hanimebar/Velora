'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Layers } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { ClassType } from '@/types/database'

const PALETTE = ['#698C60', '#C4956A', '#7A8EA0', '#A0786E', '#7A9E8C', '#B5A16E', '#8E7A9E', '#9E8A7A']

interface ClassTypesManagerProps {
  studioId: string
  initialTypes: ClassType[]
}

export function ClassTypesManager({ studioId, initialTypes }: ClassTypesManagerProps) {
  const router = useRouter()
  const [types, setTypes] = useState(initialTypes)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ClassType | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    duration_minutes: '60',
    color: PALETTE[0],
  })

  function openNew() {
    setEditing(null)
    setForm({ name: '', description: '', duration_minutes: '60', color: PALETTE[0] })
    setOpen(true)
  }

  function openEdit(type: ClassType) {
    setEditing(type)
    setForm({
      name: type.name,
      description: type.description ?? '',
      duration_minutes: String(type.duration_minutes),
      color: type.color,
    })
    setOpen(true)
  }

  async function handleSave() {
    setLoading(true)
    setError(null)
    const supabase = createClient()

    const payload = {
      studio_id: studioId,
      name: form.name,
      description: form.description || null,
      duration_minutes: parseInt(form.duration_minutes),
      color: form.color,
    }

    if (editing) {
      const { error: err } = await supabase
        .from('class_types')
        .update(payload)
        .eq('id', editing.id)

      if (err) { setError(err.message); setLoading(false); return }
      setTypes((prev) => prev.map((t) => t.id === editing.id ? { ...t, ...payload } : t))
    } else {
      const { data, error: err } = await supabase
        .from('class_types')
        .insert(payload)
        .select()
        .single()

      if (err) { setError(err.message); setLoading(false); return }
      if (data) setTypes((prev) => [...prev, data])
    }

    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this class type? This will not affect existing sessions.')) return
    const supabase = createClient()
    await supabase.from('class_types').delete().eq('id', id)
    setTypes((prev) => prev.filter((t) => t.id !== id))
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}>
              <Plus className="h-4 w-4" />
              New class type
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit class type' : 'New class type'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="ct-name">Name</Label>
                <Input
                  id="ct-name"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Morning Flow Yoga"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ct-desc">Description</Label>
                <Textarea
                  id="ct-desc"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="A gentle morning flow suitable for all levels..."
                  rows={2}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ct-dur">Duration (minutes)</Label>
                <Input
                  id="ct-dur"
                  type="number"
                  min="15"
                  max="180"
                  value={form.duration_minutes}
                  onChange={(e) => setForm((p) => ({ ...p, duration_minutes: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Colour</Label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className="h-7 w-7 rounded-full transition-velora"
                      style={{
                        backgroundColor: c,
                        outline: form.color === c ? `2px solid ${c}` : 'none',
                        outlineOffset: '2px',
                      }}
                      onClick={() => setForm((p) => ({ ...p, color: c }))}
                    />
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                <Button onClick={handleSave} disabled={loading || !form.name}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {types.length === 0 ? (
        <div className="text-center py-16 rounded-lg border" style={{ borderColor: 'var(--color-border)', color: 'var(--color-foreground-subtle)' }}>
          <Layers className="h-10 w-10 mx-auto mb-4 opacity-25" strokeWidth={1} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground-muted)' }}>No class types yet</p>
          <p className="text-sm mt-1">Create your first class type to start scheduling.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openNew}>
            <Plus className="h-4 w-4" /> Add class type
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {types.map((type) => (
            <div key={type.id} className="velora-card flex items-center gap-4">
              <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: type.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-foreground)' }}>{type.name}</p>
                {type.description && (
                  <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-foreground-subtle)' }}>{type.description}</p>
                )}
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--color-foreground-muted)' }}>
                {type.duration_minutes} min
              </span>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => openEdit(type)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
