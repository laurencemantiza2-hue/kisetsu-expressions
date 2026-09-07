import { useRef } from 'react'
import { useEditor } from '../EditorContext.jsx'
import { getByPath } from '../siteContent.js'

function computeStyle(styleOverride) {
  if (!styleOverride) return undefined
  const style = {}
  if (styleOverride.fontFamily) style.fontFamily = styleOverride.fontFamily
  if (styleOverride.fontSize) style.fontSize = `${styleOverride.fontSize}px`
  if (styleOverride.fontWeight) style.fontWeight = styleOverride.fontWeight
  if (styleOverride.color) style.color = styleOverride.color
  if (styleOverride.background) style.background = styleOverride.background
  return style
}

// Renders a text element whose content lives at `path` inside the shared
// site content. On the public site (`canEdit` false) this is just the tag
// with the text in it — no extra DOM, no behaviour change at all.
// On /admin, for an approved admin, the same element becomes either
// contentEditable (text mode) or a click target that opens the style panel
// (style mode).
export function EditableText({ path, as: Tag = 'span', className, preLine = false, style: extraStyle }) {
  const { content, canEdit, mode, updateText, setStylePanelPath } = useEditor()
  const ref = useRef(null)
  const value = getByPath(content, path) ?? ''
  const overrideStyle = computeStyle(getByPath(content, `styles.${path}`))
  const combinedStyle = { ...(preLine ? { whiteSpace: 'pre-line' } : null), ...extraStyle, ...overrideStyle }

  if (!canEdit) {
    return <Tag className={className} style={combinedStyle}>{value}</Tag>
  }

  const isTextMode = mode === 'text'

  return (
    <Tag
      ref={ref}
      className={`${className || ''} cms-editable ${isTextMode ? 'cms-editable-text' : 'cms-editable-style'}`.trim()}
      style={combinedStyle}
      contentEditable={isTextMode}
      suppressContentEditableWarning
      onBlur={isTextMode ? (event) => updateText(path, event.currentTarget.innerText) : undefined}
      onClick={!isTextMode ? (event) => {
        event.preventDefault()
        event.stopPropagation()
        setStylePanelPath(path)
      } : undefined}
    >
      {value}
    </Tag>
  )
}

// Wraps an <img> so an admin can replace it in place via a small overlay
// button. On the public site this renders exactly the plain <img> that was
// there before.
export function EditableImage({ src, alt, className, imgStyle, onUpload, uploading }) {
  const { canEdit } = useEditor()
  const inputRef = useRef(null)

  if (!canEdit) {
    return <img src={src} alt={alt} className={className} style={imgStyle} />
  }

  return (
    <span className="cms-image-wrap">
      <img src={src} alt={alt} className={className} style={imgStyle} />
      <button
        type="button"
        className="cms-image-edit-btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : 'Change image'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) onUpload(file)
        }}
      />
    </span>
  )
}
