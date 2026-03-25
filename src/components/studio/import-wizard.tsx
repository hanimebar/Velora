'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Check, AlertCircle, RefreshCw } from 'lucide-react'

type ImportStep = 'upload' | 'mapping' | 'preview' | 'done'

interface ParsedRow {
  [key: string]: string
}

interface MappedClient {
  first_name: string
  last_name: string
  email: string
  phone?: string
  status?: 'new' | 'duplicate' | 'error'
  error?: string
}

interface ImportWizardProps {
  studioId: string
  studioSlug: string
}

export function ImportWizard({ studioId, studioSlug }: ImportWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<ImportStep>('upload')
  const [headers, setHeaders] = useState<string[]>([])
  const [rows, setRows] = useState<ParsedRow[]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [mappingLoading, setMappingLoading] = useState(false)
  const [clients, setClients] = useState<MappedClient[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; errors: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const parseFile = useCallback((file: File) => {
    Papa.parse<ParsedRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        const detectedHeaders = result.meta.fields ?? []
        setHeaders(detectedHeaders)
        setRows(result.data.slice(0, 200)) // Limit preview

        // Auto-map columns via Claude
        setMappingLoading(true)
        try {
          const res = await fetch('/api/import/map-columns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ headers: detectedHeaders }),
          })
          const data = await res.json()
          if (res.ok && data.mapping) {
            setMapping(data.mapping)
          }
        } catch {
          // Silent fail — user can map manually
        }
        setMappingLoading(false)
        setStep('mapping')
      },
      error: (err) => {
        console.error('CSV parse error:', err)
      },
    })
  }, [])

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file?.name.endsWith('.csv')) parseFile(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  function buildPreview() {
    const mapped = rows.map((row): MappedClient => {
      const first_name = row[mapping.first_name] ?? ''
      const last_name = row[mapping.last_name] ?? ''
      const email = row[mapping.email] ?? ''
      const phone = mapping.phone ? row[mapping.phone] : undefined

      if (!email) return { first_name, last_name, email, phone, status: 'error', error: 'Missing email' }
      if (!first_name && !last_name) return { first_name, last_name, email, phone, status: 'error', error: 'Missing name' }

      return { first_name, last_name, email, phone, status: 'new' }
    })
    setClients(mapped)
    setStep('preview')
  }

  async function runImport() {
    setImporting(true)
    const validClients = clients.filter((c) => c.status === 'new')

    try {
      const res = await fetch('/api/import/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studio_id: studioId, studio_slug: studioSlug, clients: validClients }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setImportResult(data)
      setStep('done')
    } catch (err) {
      console.error(err)
    } finally {
      setImporting(false)
    }
  }

  const FIELD_OPTIONS = ['first_name', 'last_name', 'email', 'phone', '(ignore)']

  if (step === 'upload') {
    return (
      <div>
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-velora ${dragOver ? 'border-[var(--color-accent)]' : ''}`}
          style={{ borderColor: dragOver ? 'var(--color-accent)' : 'var(--color-border)', backgroundColor: dragOver ? 'var(--color-accent-light)' : 'var(--color-surface)' }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-foreground)' }} strokeWidth={1} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>Drop your CSV here</p>
          <p className="text-sm mt-1 mb-4" style={{ color: 'var(--color-foreground-muted)' }}>
            Supports Mindbody client export and most CSV formats
          </p>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-velora" style={{ backgroundColor: 'var(--color-accent)', color: 'white' }}>
              <FileText className="h-4 w-4" />
              Choose file
            </span>
            <input type="file" accept=".csv" className="sr-only" onChange={handleFileInput} />
          </label>
        </div>

        <div className="mt-6 p-4 rounded border text-sm" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-foreground-muted)' }}>
          <p className="font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>How to export from Mindbody:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>In Mindbody, go to Clients &rarr; Client List</li>
            <li>Click &ldquo;Export&rdquo; and select CSV format</li>
            <li>Upload the downloaded file here</li>
          </ol>
        </div>
      </div>
    )
  }

  if (step === 'mapping') {
    return (
      <div>
        <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-foreground)' }}>Map your columns</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-foreground-muted)' }}>
          {mappingLoading ? 'Detecting column types...' : `${headers.length} columns detected. Verify the mapping below.`}
        </p>

        {/* Preview first 3 rows */}
        <div className="mb-6 rounded border overflow-hidden text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-4 py-2 field-label grid gap-2" style={{ backgroundColor: 'var(--color-surface)', gridTemplateColumns: `repeat(${Math.min(headers.length, 5)}, 1fr)` }}>
            {headers.slice(0, 5).map((h) => <span key={h} className="truncate">{h}</span>)}
          </div>
          {rows.slice(0, 3).map((row, i) => (
            <div key={i} className="px-4 py-2 grid gap-2 border-t" style={{ borderColor: 'var(--color-border)', gridTemplateColumns: `repeat(${Math.min(headers.length, 5)}, 1fr)` }}>
              {headers.slice(0, 5).map((h) => (
                <span key={h} className="truncate" style={{ color: 'var(--color-foreground)' }}>{row[h] ?? '—'}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {headers.map((header) => (
            <div key={header} className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--color-foreground)' }}>{header}</p>
                <p className="text-xs" style={{ color: 'var(--color-foreground-subtle)' }}>
                  e.g. &ldquo;{rows[0]?.[header] ?? '—'}&rdquo;
                </p>
              </div>
              <span className="text-[var(--color-foreground-subtle)]">&rarr;</span>
              <select
                className="h-9 rounded border px-2 text-sm flex-1 max-w-[180px]"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-foreground)' }}
                value={Object.entries(mapping).find(([, v]) => v === header)?.[0] ?? '(ignore)'}
                onChange={(e) => {
                  const field = e.target.value
                  if (field === '(ignore)') {
                    setMapping((prev) => {
                      const next = { ...prev }
                      Object.keys(next).forEach((k) => { if (next[k] === header) delete next[k] })
                      return next
                    })
                  } else {
                    setMapping((prev) => ({ ...prev, [field]: header }))
                  }
                }}
              >
                {FIELD_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f === '(ignore)' ? '— ignore —' : f.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
          <Button onClick={buildPreview} disabled={!mapping.email}>
            Preview import ({rows.length} rows)
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'preview') {
    const newCount = clients.filter((c) => c.status === 'new').length
    const errCount = clients.filter((c) => c.status === 'error').length

    return (
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="badge badge-active">{newCount} to import</span>
          {errCount > 0 && <span className="badge badge-cancelled">{errCount} errors</span>}
        </div>

        <div className="rounded border overflow-hidden mb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="px-4 py-2 grid grid-cols-4 gap-4 field-label" style={{ backgroundColor: 'var(--color-surface)' }}>
            <span>First name</span>
            <span>Last name</span>
            <span>Email</span>
            <span>Status</span>
          </div>
          <div className="divide-y max-h-80 overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
            {clients.map((c, i) => (
              <div key={i} className="px-4 py-2.5 grid grid-cols-4 gap-4 text-sm border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span style={{ color: 'var(--color-foreground)' }}>{c.first_name || '—'}</span>
                <span style={{ color: 'var(--color-foreground)' }}>{c.last_name || '—'}</span>
                <span className="truncate" style={{ color: 'var(--color-foreground-muted)' }}>{c.email}</span>
                <span className={`badge ${c.status === 'new' ? 'badge-active' : 'badge-cancelled'}`}>
                  {c.status === 'error' ? c.error : c.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setStep('mapping')}>Back</Button>
          <Button onClick={runImport} disabled={importing || newCount === 0}>
            {importing ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Importing...</>
            ) : (
              `Import ${newCount} clients`
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'done' && importResult) {
    return (
      <div className="text-center py-12">
        <div className="h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: 'var(--color-accent-light)' }}>
          <Check className="h-7 w-7" style={{ color: 'var(--color-accent)' }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground)' }}>Import complete</h2>
        <p className="text-sm mb-1" style={{ color: 'var(--color-foreground-muted)' }}>
          {importResult.imported} clients imported successfully.
        </p>
        {importResult.errors > 0 && (
          <p className="text-sm flex items-center justify-center gap-1.5" style={{ color: 'var(--color-warning)' }}>
            <AlertCircle className="h-4 w-4" /> {importResult.errors} rows had errors and were skipped.
          </p>
        )}
        <p className="text-sm mt-3" style={{ color: 'var(--color-foreground-muted)' }}>
          A welcome email has been sent to all imported clients.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button variant="outline" onClick={() => { setStep('upload'); setClients([]); setRows([]); setHeaders([]) }}>
            Import another file
          </Button>
          <Button onClick={() => router.push('/studio/members')}>View members</Button>
        </div>
      </div>
    )
  }

  return null
}
