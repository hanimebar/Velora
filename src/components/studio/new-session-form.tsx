'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ClassType } from '@/types/database'

const RECURRENCE_OPTIONS = [
  { value: 'none', label: 'One-off (does not repeat)' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every two weeks' },
]

interface NewSessionFormProps {
  studioId: string
  classTypes: ClassType[]
  timezone: string
}

export function NewSessionForm({ studioId, classTypes, timezone }: NewSessionFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    class_type_id: '',
    instructor_name: '',
    date: '',
    time: '',
    capacity: '12',
    recurrence: 'none',
    recurrence_count: '8',
  })

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Find class type duration
      const classType = classTypes.find((ct) => ct.id === form.class_type_id)
      if (!classType) throw new Error('Please select a class type')

      const startsAt = new Date(`${form.date}T${form.time}`)
      const endsAt = new Date(startsAt.getTime() + classType.duration_minutes * 60 * 1000)

      const body = {
        studio_id: studioId,
        class_type_id: form.class_type_id,
        instructor_name: form.instructor_name,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        capacity: parseInt(form.capacity),
        recurrence: form.recurrence,
        recurrence_count: parseInt(form.recurrence_count),
        timezone,
      }

      const res = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create session')

      router.push('/studio/schedule')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {classTypes.length === 0 ? (
        <div className="rounded border p-4 text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-foreground-muted)' }}>
          You need to create a class type before scheduling sessions.{' '}
          <a href="/studio/classes" className="underline underline-offset-2" style={{ color: 'var(--color-accent)' }}>
            Create one now
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <Label>Class type</Label>
            <Select value={form.class_type_id} onValueChange={(v) => update('class_type_id', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class type" />
              </SelectTrigger>
              <SelectContent>
                {classTypes.map((ct) => (
                  <SelectItem key={ct.id} value={ct.id}>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ct.color }} />
                      {ct.name} ({ct.duration_minutes} min)
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="instructor_name">Instructor</Label>
            <Input
              id="instructor_name"
              required
              value={form.instructor_name}
              onChange={(e) => update('instructor_name', e.target.value)}
              placeholder="Sofia Lindqvist"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                required
                value={form.date}
                onChange={(e) => update('date', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="time">Start time</Label>
              <Input
                id="time"
                type="time"
                required
                value={form.time}
                onChange={(e) => update('time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="capacity">Capacity (max spots)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="200"
              required
              value={form.capacity}
              onChange={(e) => update('capacity', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Recurrence</Label>
            <Select value={form.recurrence} onValueChange={(v) => update('recurrence', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECURRENCE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {form.recurrence !== 'none' && (
            <div className="space-y-1.5">
              <Label htmlFor="recurrence_count">Number of occurrences</Label>
              <Input
                id="recurrence_count"
                type="number"
                min="2"
                max="52"
                value={form.recurrence_count}
                onChange={(e) => update('recurrence_count', e.target.value)}
              />
              <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                Creates {form.recurrence_count} sessions starting from the date above.
              </p>
            </div>
          )}

          {error && (
            <div className="rounded border px-3 py-2.5 text-sm" style={{ backgroundColor: 'var(--color-danger-light)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !form.class_type_id}>
              {loading ? 'Creating...' : form.recurrence === 'none' ? 'Create session' : `Create ${form.recurrence_count} sessions`}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
