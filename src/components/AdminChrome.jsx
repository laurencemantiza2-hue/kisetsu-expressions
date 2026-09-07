import { useState } from 'react'
import { useEditor } from '../EditorContext.jsx'
import { getByPath } from '../siteContent.js'
import { hasSupabaseConfig } from '../supabase.js'
import './AdminChrome.css'

const FONT_OPTIONS = [
  { label: 'Clean (Arial)', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Classic (Georgia)', value: 'Georgia, serif' },
  { label: 'Friendly (Trebuchet)', value: 'Trebuchet MS, sans-serif' },
  { label: 'Site default', value: '' },
]

const WEIGHT_OPTIONS = [
  { label: 'Normal', value: '400' },
  { label: 'Medium', value: '600' },
  { label: 'Bold', value: '800' },
]

export default function AdminChrome() {
  const { canEdit, session, isAdmin, checkingAdmin } = useEditor()

  if (!hasSupabaseConfig) return <SetupBanner />
  if (!session) return <SignInGate />
  if (checkingAdmin) return null
  if (!isAdmin) return <AccessPendingGate />
  if (!canEdit) return null

  return (
    <>
      <Toolbar />
      <StylePanel />
    </>
  )
}

function SetupBanner() {
  return (
    <div className="cms-banner">
      Editor setup is not finished — add the Supabase URL and anon key to the environment, then reload.
    </div>
  )
}

function SignInGate() {
  const { signIn, status } = useEditor()
  const [email, setEmail] = useState('')

  return (
    <div className="cms-overlay">
      <form
        className="cms-card"
        onSubmit={(event) => {
          event.preventDefault()
          signIn(email)
        }}
      >
        <p className="cms-kicker">KISETSU EXPRESSIONS</p>
        <h2>Sign in to edit this website</h2>
        <p>Enter the email address approved to edit the site. You'll get a secure sign-in link.</p>
        <label>
          Email address
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <button type="submit">Send secure sign-in link</button>
        {status && <p className="cms-status">{status}</p>}
      </form>
    </div>
  )
}

function AccessPendingGate() {
  const { signOut } = useEditor()
  return (
    <div className="cms-overlay">
      <div className="cms-card">
        <h2>Access pending</h2>
        <p>This email has signed in, but it hasn't been approved as a website editor yet. Ask the website owner to approve your account.</p>
        <button type="button" onClick={signOut}>Sign out</button>
      </div>
    </div>
  )
}

function Toolbar() {
  const { mode, setMode, save, status, dirty, signOut } = useEditor()

  return (
    <div className="cms-toolbar">
      <span className="cms-toolbar-label">Editing website</span>

      <div className="cms-toolbar-modes">
        <button type="button" className={mode === 'text' ? 'is-active' : ''} onClick={() => setMode('text')}>
          Text
        </button>
        <button type="button" className={mode === 'style' ? 'is-active' : ''} onClick={() => setMode('style')}>
          Style
        </button>
      </div>

      <button type="button" className="cms-toolbar-save" onClick={save}>
        {dirty ? 'Save changes' : 'Saved'}
      </button>

      <a href="/" className="cms-toolbar-link">View public site</a>
      <button type="button" className="cms-toolbar-link" onClick={signOut}>Sign out</button>

      {status && <span className="cms-toolbar-status">{status}</span>}
    </div>
  )
}

function StylePanel() {
  const { content, stylePanelPath, setStylePanelPath, updateStyle, clearStyle } = useEditor()
  if (!stylePanelPath) return null

  const current = getByPath(content, `styles.${stylePanelPath}`) || {}

  return (
    <div className="cms-style-panel">
      <div className="cms-style-panel-header">
        <span>Appearance</span>
        <button type="button" onClick={() => setStylePanelPath(null)} aria-label="Close">×</button>
      </div>

      <label>
        Font family
        <select
          value={current.fontFamily || ''}
          onChange={(event) => updateStyle(stylePanelPath, { fontFamily: event.target.value || undefined })}
        >
          {FONT_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        Font size ({current.fontSize || 'default'}px)
        <input
          type="range"
          min="10"
          max="120"
          value={current.fontSize || 18}
          onChange={(event) => updateStyle(stylePanelPath, { fontSize: Number(event.target.value) })}
        />
      </label>

      <label>
        Font weight
        <select
          value={current.fontWeight || ''}
          onChange={(event) => updateStyle(stylePanelPath, { fontWeight: event.target.value || undefined })}
        >
          <option value="">Site default</option>
          {WEIGHT_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>

      <label>
        Text color
        <input
          type="color"
          value={current.color || '#111111'}
          onChange={(event) => updateStyle(stylePanelPath, { color: event.target.value })}
        />
      </label>

      <label>
        Background color
        <input
          type="color"
          value={current.background || '#ffffff'}
          onChange={(event) => updateStyle(stylePanelPath, { background: event.target.value })}
        />
      </label>

      <button type="button" className="cms-style-clear" onClick={() => clearStyle(stylePanelPath)}>
        Reset to site default
      </button>
    </div>
  )
}
