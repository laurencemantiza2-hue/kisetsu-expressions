import { useRef, useState } from 'react'

import { useEditor } from '../EditorContext.jsx'

import { getByPath } from '../siteContent.js'

import { hasSupabaseConfig } from '../supabase.js'

import { uploadSiteImage } from '../lib/paintings.js'

import CatalogManager from './CatalogManager.jsx'

import './AdminChrome.css'

const FONT_OPTIONS = [
  {
    label: 'Clean (Arial)',
    value: 'Arial, Helvetica, sans-serif',
  },
  {
    label: 'Classic (Georgia)',
    value: 'Georgia, serif',
  },
  {
    label: 'Friendly (Trebuchet)',
    value: 'Trebuchet MS, sans-serif',
  },
  {
    label: 'Site default',
    value: '',
  },
]

const WEIGHT_OPTIONS = [
  {
    label: 'Normal',
    value: '400',
  },
  {
    label: 'Medium',
    value: '600',
  },
  {
    label: 'Bold',
    value: '800',
  },
]

export default function AdminChrome({ adminMode }) {
  const {
    canEdit,
    session,
    isAdmin,
    checkingAdmin,
  } = useEditor()

  const [showPromotionManager, setShowPromotionManager] = useState(false)

  // The editor/login UI must only ever mount on the /admin route.
  // Every check below (session, isAdmin, canEdit) is about authorization.
  if (!adminMode) return null

  if (!hasSupabaseConfig) {
    return <SetupBanner />
  }

  if (!session) {
    return <SignInGate />
  }

  if (checkingAdmin) {
    return (
      <div className="cms-overlay">
        <div className="cms-card">
          <p className="cms-kicker">
            KISETSU EXPRESSIONS
          </p>

          <h2>Checking admin access...</h2>

          <p>
            Please wait while we verify your website
            editor access.
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin || !canEdit) {
    return <AccessPendingGate />
  }

  return (
    <>
      <Toolbar
        onOpenPromotion={() => setShowPromotionManager(true)}
        promotionOpen={showPromotionManager}
      />

      <CatalogManager />

      <StylePanel />

      {showPromotionManager && (
        <PromotionManager
          onClose={() => setShowPromotionManager(false)}
        />
      )}
    </>
  )
}

function SetupBanner() {
  return (
    <div className="cms-banner">
      Editor setup is not finished — add the Supabase URL
      and anon key to the environment, then reload.
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
        <p className="cms-kicker">
          KISETSU EXPRESSIONS
        </p>

        <h2>Sign in to edit this website</h2>

        <p>
          Enter the email address approved to edit the
          site. You'll get a secure sign-in link.
        </p>

        <label>
          Email address

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        <button type="submit">
          Send secure sign-in link
        </button>

        {status && (
          <p className="cms-status">
            {status}
          </p>
        )}
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

        <p>
          This email has signed in, but it hasn't been
          approved as a website editor yet. Ask the
          website owner to approve your account.
        </p>

        <button
          type="button"
          onClick={signOut}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

function Toolbar({ onOpenPromotion, promotionOpen }) {
  const {
    mode,
    setMode,
    save,
    status,
    dirty,
    signOut,
  } = useEditor()

  return (
    <div className="cms-toolbar">
      <span className="cms-toolbar-label">
        Editing website
      </span>

      <div className="cms-toolbar-modes">
        <button
          type="button"
          className={
            mode === 'text' ? 'is-active' : ''
          }
          onClick={() => setMode('text')}
        >
          Text
        </button>

        <button
          type="button"
          className={
            mode === 'style' ? 'is-active' : ''
          }
          onClick={() => setMode('style')}
        >
          Style
        </button>
      </div>

      <button
        type="button"
        className={`cms-toolbar-promotion ${promotionOpen ? 'is-active' : ''}`.trim()}
        onClick={onOpenPromotion}
      >
        Promotion
      </button>

      <button
        type="button"
        className="cms-toolbar-save"
        onClick={save}
      >
        {dirty ? 'Save changes' : 'Saved'}
      </button>

      <a
        href="/"
        className="cms-toolbar-link"
      >
        View public site
      </a>

      <button
        type="button"
        className="cms-toolbar-link"
        onClick={signOut}
      >
        Sign out
      </button>

      {status && (
        <span className="cms-toolbar-status">
          {status}
        </span>
      )}
    </div>
  )
}

function PromotionManager({ onClose }) {
  const {
    content,
    updateText,
    dirty,
    save,
  } = useEditor()

  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const promotion = content?.promotion || {}

  const updatePromotion = (field, value) => {
    updateText(`promotion.${field}`, value)
  }

  const handlePosterUpload = async (file) => {
    if (!file) return

    setUploading(true)
    setUploadError('')

    try {
      const { url } = await uploadSiteImage(file, 'promotions')

      updatePromotion('image', url)

      // A fresh ID makes a newly uploaded promotion eligible to appear
      // again even for visitors who dismissed the previous promotion.
      updatePromotion('id', `promotion-${Date.now()}`)
    } catch (error) {
      console.error('Promotion poster upload failed:', error)
      setUploadError(
        error?.message ||
          'The poster could not be uploaded. Please try again.',
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <div
      className="cms-promotion-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="cms-promotion-manager"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-promotion-title"
      >
        <div className="cms-promotion-header">
          <div>
            <p className="cms-promotion-kicker">
              WEBSITE PROMOTION
            </p>

            <h2 id="cms-promotion-title">
              Promotion Manager
            </h2>

            <p>
              Manage the current poster and where the promotion
              appears. Use the website's Save changes button when
              you are finished.
            </p>
          </div>

          <button
            type="button"
            className="cms-promotion-close"
            onClick={onClose}
            aria-label="Close Promotion Manager"
          >
            ×
          </button>
        </div>

        <div className="cms-promotion-grid">
          <div className="cms-promotion-poster-column">
            <div className="cms-promotion-preview">
              {promotion.image ? (
                <img
                  src={promotion.image}
                  alt={promotion.title || 'Current promotion poster'}
                />
              ) : (
                <div className="cms-promotion-empty-poster">
                  <strong>No poster uploaded</strong>
                  <span>
                    Upload the client's promotion artwork here.
                  </span>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="cms-promotion-file-input"
              onChange={(event) => {
                const file = event.target.files?.[0]
                event.target.value = ''
                if (file) handlePosterUpload(file)
              }}
            />

            <button
              type="button"
              className="cms-promotion-upload"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading
                ? 'Uploading poster...'
                : promotion.image
                  ? 'Replace poster'
                  : 'Upload poster'}
            </button>

            <p className="cms-promotion-help">
              The image is uploaded to Supabase Storage, not to
              <code> src/assets </code>. Uploading a new poster
              automatically creates a fresh promotion ID.
            </p>

            {uploadError && (
              <p className="cms-promotion-error">
                {uploadError}
              </p>
            )}
          </div>

          <div className="cms-promotion-fields">
            <label>
              Promotion title

              <input
                type="text"
                value={promotion.title || ''}
                onChange={(event) =>
                  updatePromotion('title', event.target.value)
                }
                placeholder="Arts & Drawing Classes"
              />
            </label>

            <label>
              Short description

              <textarea
                rows="4"
                value={promotion.description || ''}
                onChange={(event) =>
                  updatePromotion('description', event.target.value)
                }
                placeholder="A short message shown with the poster."
              />
            </label>

            <label>
              Button label

              <input
                type="text"
                value={promotion.buttonLabel || ''}
                onChange={(event) =>
                  updatePromotion('buttonLabel', event.target.value)
                }
                placeholder="Learn More"
              />
            </label>

            <div className="cms-promotion-toggles">
              <PromotionToggle
                label="Promotion active"
                description="Master switch for this promotion."
                checked={Boolean(promotion.enabled)}
                onChange={(checked) =>
                  updatePromotion('enabled', checked)
                }
              />

              <PromotionToggle
                label="Show popup"
                description="Show the poster popup to eligible visitors."
                checked={Boolean(promotion.showPopup)}
                onChange={(checked) =>
                  updatePromotion('showPopup', checked)
                }
              />

              <PromotionToggle
                label="Show on homepage"
                description="Keep the promotion visible in the homepage promotion section."
                checked={Boolean(promotion.showOnHomepage)}
                onChange={(checked) =>
                  updatePromotion('showOnHomepage', checked)
                }
              />
            </div>

            <div className="cms-promotion-id">
              <span>Promotion ID</span>
              <code>{promotion.id || 'Not created yet'}</code>
              <small>
                This is managed automatically when a new poster is uploaded.
              </small>
            </div>
          </div>
        </div>

        <div className="cms-promotion-footer">
          <div>
            <strong>
              {dirty ? 'Unsaved changes' : 'All changes saved'}
            </strong>

            <span>
              {dirty
                ? ' Save before leaving the admin page.'
                : ' The saved promotion settings are live.'}
            </span>
          </div>

          <div className="cms-promotion-footer-actions">
            <button
              type="button"
              className="cms-promotion-secondary"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="cms-promotion-save"
              onClick={save}
              disabled={!dirty || uploading}
            >
              {dirty ? 'Save promotion' : 'Saved'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PromotionToggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <label className="cms-promotion-toggle">
      <span>
        <strong>{label}</strong>
        <small>{description}</small>
      </span>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span
        className="cms-promotion-switch"
        aria-hidden="true"
      />
    </label>
  )
}

function StylePanel() {
  const {
    content,
    stylePanelPath,
    setStylePanelPath,
    updateStyle,
    clearStyle,
  } = useEditor()

  if (!stylePanelPath) return null

  const current =
    getByPath(
      content,
      `styles.${stylePanelPath}`,
    ) || {}

  return (
    <div className="cms-style-panel">
      <div className="cms-style-panel-header">
        <span>Appearance</span>

        <button
          type="button"
          onClick={() => setStylePanelPath(null)}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <label>
        Font family

        <select
          value={current.fontFamily || ''}
          onChange={(event) =>
            updateStyle(stylePanelPath, {
              fontFamily:
                event.target.value || undefined,
            })
          }
        >
          {FONT_OPTIONS.map((option) => (
            <option
              key={option.label}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Font size (
        {current.fontSize || 'default'}
        px)

        <input
          type="range"
          min="10"
          max="120"
          value={current.fontSize || 18}
          onChange={(event) =>
            updateStyle(stylePanelPath, {
              fontSize: Number(
                event.target.value,
              ),
            })
          }
        />
      </label>

      <label>
        Font weight

        <select
          value={current.fontWeight || ''}
          onChange={(event) =>
            updateStyle(stylePanelPath, {
              fontWeight:
                event.target.value || undefined,
            })
          }
        >
          <option value="">
            Site default
          </option>

          {WEIGHT_OPTIONS.map((option) => (
            <option
              key={option.label}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Text color

        <input
          type="color"
          value={current.color || '#111111'}
          onChange={(event) =>
            updateStyle(stylePanelPath, {
              color: event.target.value,
            })
          }
        />
      </label>

      <label>
        Background color

        <input
          type="color"
          value={
            current.background || '#ffffff'
          }
          onChange={(event) =>
            updateStyle(stylePanelPath, {
              background: event.target.value,
            })
          }
        />
      </label>

      <button
        type="button"
        className="cms-style-clear"
        onClick={() =>
          clearStyle(stylePanelPath)
        }
      >
        Reset to site default
      </button>
    </div>
  )
}
