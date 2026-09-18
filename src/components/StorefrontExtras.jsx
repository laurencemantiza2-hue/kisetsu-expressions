import { useEffect, useState } from 'react'
import { useEditor } from '../EditorContext.jsx'
import { EditableText } from './Editable.jsx'

export function ContactIcon({ kind }) {
  if (kind === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 22v-9h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A24 24 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v9z" /></svg>
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{kind === 'whatsapp' && <path d="M21 11.5a9 9 0 0 1-13.4 8L3 21l1.4-4.6A9 9 0 1 1 21 11.5Z" />}<path d={kind === 'whatsapp' ? 'M8 7l2 3-1 1c1 2 2 3 4 3l1-1 3 2c-1 4-9 0-10-5 0-1 0-2 1-3Z' : 'M5 3l4 4-2 3c1 3 4 6 7 7l3-2 4 4c-1 5-7 3-12-2S2 5 5 3Z'} /></svg>
}
export function ContactLinks({ whatsappLink, facebookLink }) {
  return <div className="contact-icon-links">
    <a href={facebookLink} target="_blank" rel="noopener noreferrer" aria-label="Kisetsu Expressions on Facebook" title="Facebook"><ContactIcon kind="facebook" /></a>
    <a href="tel:+971545735918" aria-label="Call Kisetsu Expressions: +971 54 573 5918" title="Call +971 54 573 5918"><ContactIcon kind="phone" /></a>
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="Message Kisetsu Expressions on WhatsApp" title="WhatsApp"><ContactIcon kind="whatsapp" /></a>
  </div>
}
export function FloatingContact({ whatsappLink, suppressed }) {
  const { adminMode } = useEditor()
  const [prompt, setPrompt] = useState('')
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (dismissed) return undefined
    const update = () => {
      if (window.scrollY < 300) { setPrompt(''); return }
      const near = id => { const r = document.getElementById(id)?.getBoundingClientRect(); return r && r.top < innerHeight * .7 && r.bottom > innerHeight * .2 }
      setPrompt(near('tshirts') ? 'Interested in a T-shirt?' : near('paintings') || near('student-art') ? 'Interested in art?' : 'What’s new at Kisetsu?')
    }
    window.addEventListener('scroll', update, { passive: true }); update()
    return () => window.removeEventListener('scroll', update)
  }, [dismissed])
  if (adminMode || suppressed) return null
  return <aside className="floating-contact" aria-label="Contact Kisetsu">
    {prompt && !dismissed && <div className="contact-prompt"><a href={`${whatsappLink}?text=${encodeURIComponent(`Hi Kisetsu! ${prompt}`)}`} target="_blank" rel="noopener noreferrer">{prompt}</a><button aria-label="Dismiss inquiry prompts" onClick={() => setDismissed(true)}>×</button></div>}
    <a className="whatsapp-float" href={whatsappLink} target="_blank" rel="noopener noreferrer" title="Talk to us on WhatsApp" aria-label="Talk to us on WhatsApp"><ContactIcon kind="whatsapp" /></a>
  </aside>
}
export function FeedbackSection({ whatsappLink }) {
  const { content, canEdit } = useEditor()
  const reviews = (content.feedback?.items || []).filter(r => r.approved && r.quote?.trim() && r.name?.trim())
  return <section id="feedback" className="feedback-section">
    <EditableText path="feedback.eyebrow" as="p" className="eyebrow" />
    <EditableText path="feedback.heading" as="h2" />
    <div className="feedback-grid">{reviews.map(r => <figure key={r.id}><blockquote>“{r.quote}”</blockquote><figcaption>— {r.name}</figcaption></figure>)}</div>
    {reviews.length === 0 && <p>Your experience matters. Tell us about your Kisetsu purchase or workshop.</p>}
    <a className="button button-primary" href={`${whatsappLink}?text=${encodeURIComponent('Hi Kisetsu! I would like to share feedback about my experience.')}`} target="_blank" rel="noopener noreferrer">Share your feedback</a>
    {canEdit && <p>Manage testimonials under Storefront → Feedback. Publish only genuine feedback with the customer’s permission.</p>}
  </section>
}
