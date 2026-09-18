import { useEffect, useRef } from 'react'
export default function useDialog(onClose) {
  const ref = useRef(null)
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const selector = 'button:not([disabled]), a[href], input:not([disabled]), select, textarea, [tabindex="0"]'
    ref.current?.querySelector(selector)?.focus()
    function keydown(e) {
      if (e.key === 'Escape') { e.preventDefault(); close.current() }
      if (e.key !== 'Tab') return
      const nodes = [...(ref.current?.querySelectorAll(selector) || [])].filter(n => n.getClientRects().length)
      const first = nodes[0], last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus() }
  }, [])
  return ref
}
