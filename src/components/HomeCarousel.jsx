import { useEffect, useState } from 'react'
import { useEditor } from '../EditorContext.jsx'
import { EditableImage } from './Editable.jsx'
import { uploadSiteImage } from '../lib/paintings.js'

const slides = [
  ['purposeSeptember20', 'Live With Purpose T-shirts', '/carousel/september-20/01-live-with-purpose.png'],
  ['paintingsSeptember20', 'Paintings', '/carousel/september-20/02-paintings.png'],
  ['studentsSeptember20', 'Students’ Work', '/carousel/september-20/03-students-work.png'],
  ['workshopsSeptember20', 'Workshop', '/carousel/september-20/04-workshop.png'],
]

export default function HomeCarousel() {
  const { content, canEdit, updateText } = useEditor()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [uploading, setUploading] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => { if (media.matches) setPaused(true) }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    if (paused || uploading) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [paused, uploading])
  async function upload(key, file) {
    setUploading(key)
    setError('')
    try {
      const { url } = await uploadSiteImage(file, 'carousel')
      updateText(`carousel.${key}`, url)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally { setUploading(null) }
  }
  return <section id="home" className="home-carousel" aria-label="Kisetsu highlights" aria-roledescription="carousel">
    <div className="home-slides">
      {slides.map(([key, label, defaultImage], index) => <div key={key}
        className={'home-slide' + (index === active ? ' is-active' : '')}
        aria-hidden={index !== active} inert={index !== active}
        role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${label}`}>
        <EditableImage src={content.carousel?.[key] || defaultImage} alt={label}
          onUpload={file => upload(key, file)} uploading={uploading === key} />
      </div>)}
    </div>
    <div className="home-controls">
      <button type="button" aria-label="Previous slide" onClick={() => setActive(index => (index + slides.length - 1) % slides.length)}>←</button>
      <div className="home-dots">{slides.map(([key, label], index) => <button
        key={key} type="button" aria-label={`Show ${label}`} aria-current={active === index ? 'true' : undefined}
        onClick={() => setActive(index)}><span /></button>)}</div>
      <button type="button" aria-label="Next slide" onClick={() => setActive(index => (index + 1) % slides.length)}>→</button>
      {<button type="button" aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
        aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? '▶' : 'Ⅱ'}</button>}
    </div>
    {canEdit && <p className="carousel-editor-note">Use arrows to select a slide. Pause to edit its image, then Save in the admin toolbar.</p>}
    {error && <p role="alert">{error}</p>}
  </section>
}
