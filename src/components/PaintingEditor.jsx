import { useState } from 'react'
import { createPainting, deleteImageByUrl, deletePainting, updatePainting, uploadPaintingImage } from '../lib/paintings.js'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'sold', label: 'Sold' },
  { value: 'hidden', label: 'Hidden from website' },
]

export default function PaintingEditor({ painting, onClose, onSaved, onDeleted }) {
  const isNew = !painting
  const [form, setForm] = useState({
    title: painting?.title || '',
    description: painting?.description || '',
    price_text: painting?.price_text || '',
    category: painting?.category || '',
    status: painting?.status || 'available',
    image_url: painting?.image_url || '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { url } = await uploadPaintingImage(file)
      setField('image_url', url)
    } catch (uploadError) {
      setError(uploadError.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      if (isNew) {
        const created = await createPainting(form)
        onSaved(created)
      } else {
        const updated = await updatePainting(painting.id, form)
        onSaved(updated)
      }
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!painting) return
    if (!window.confirm(`Delete "${painting.title}"? This cannot be undone.`)) return
    setSaving(true)
    setError('')
    try {
      await deletePainting(painting.id)
      await deleteImageByUrl(painting.image_url)
      onDeleted(painting.id)
    } catch (deleteError) {
      setError(deleteError.message)
      setSaving(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? 'Add painting' : 'Edit painting'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 4100,
        background: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: 'min(560px, 100%)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: '#fff',
          color: '#111',
          padding: 'clamp(20px, 4vw, 40px)',
          borderRadius: 6,
          boxShadow: '0 24px 80px rgba(0,0,0,.28)',
        }}
      >
        <p style={{ fontSize: 12, letterSpacing: '.12em', fontWeight: 800, color: '#123b5d', margin: '0 0 6px' }}>
          {isNew ? 'ADD PAINTING' : 'EDIT PAINTING'}
        </p>
        <h2 style={{ margin: '0 0 20px' }}>{isNew ? 'New painting' : painting.title}</h2>

        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            {form.image_url ? (
              <img src={form.image_url} alt="Painting preview" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 4, marginBottom: 10 }} />
            ) : null}
            <label style={{ display: 'inline-block', background: '#123b5d', color: '#fff', padding: '9px 16px', borderRadius: 4, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
              {uploading ? 'Uploading…' : form.image_url ? 'Replace image' : 'Upload image'}
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          <label style={{ fontSize: 13, fontWeight: 700, color: '#123b5d' }}>
            Title
            <input
              value={form.title}
              onChange={(event) => setField('title', event.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ fontSize: 13, fontWeight: 700, color: '#123b5d' }}>
            Description
            <textarea
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: '#123b5d' }}>
              Price
              <input
                value={form.price_text}
                onChange={(event) => setField('price_text', event.target.value)}
                placeholder="e.g. AED 800"
                style={inputStyle}
              />
            </label>

            <label style={{ fontSize: 13, fontWeight: 700, color: '#123b5d' }}>
              Category
              <input
                value={form.category}
                onChange={(event) => setField('category', event.target.value)}
                placeholder="e.g. Landscape"
                style={inputStyle}
              />
            </label>
          </div>

          <label style={{ fontSize: 13, fontWeight: 700, color: '#123b5d' }}>
            Availability
            <select value={form.status} onChange={(event) => setField('status', event.target.value)} style={inputStyle}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p style={{ color: '#b22222', marginTop: 14 }}>{error}</p>}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="button button-primary" onClick={handleSave} disabled={saving || uploading}>
              {saving ? 'Saving…' : 'Save painting'}
            </button>
            <button type="button" className="button button-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
          </div>
          {!isNew && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              style={{ background: 'transparent', border: '1px solid #b22222', color: '#b22222', borderRadius: 4, padding: '9px 16px', cursor: 'pointer', fontWeight: 700 }}
            >
              Delete painting
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 6,
  padding: '9px 11px',
  border: '1px solid #ccc',
  borderRadius: 4,
  fontSize: 14,
  fontFamily: 'inherit',
}
