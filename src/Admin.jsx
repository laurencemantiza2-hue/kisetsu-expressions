import { useEffect, useState } from 'react'
import { hasSupabaseConfig, supabase } from './supabase.js'
import { defaultSiteContent, mergeSiteContent } from './siteContent.js'
import './Admin.css'

function cloneContent(content) {
  return JSON.parse(JSON.stringify(content))
}

export default function Admin() {
  const [email, setEmail] = useState('')
  const [session, setSession] = useState(null)
  const [content, setContent] = useState(() => cloneContent(defaultSiteContent))
  const [status, setStatus] = useState('')
  const [isAllowed, setIsAllowed] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session || !supabase) return
    async function loadContent() {
      const [{ data: admin }, { data: settings, error }] = await Promise.all([
        supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('site_settings').select('content').eq('id', 'default').maybeSingle(),
      ])
      setIsAllowed(Boolean(admin))
      if (error) setStatus('Could not load the website settings.')
      if (settings?.content) setContent(mergeSiteContent(settings.content))
    }
    loadContent()
  }, [session])

  const updateHero = (field, value) => setContent((current) => ({
    ...current, hero: { ...current.hero, [field]: value },
  }))

  const updateTheme = (field, value) => setContent((current) => ({
    ...current, theme: { ...current.theme, [field]: value },
  }))

  async function signIn(event) {
    event.preventDefault()
    setStatus('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    setStatus(error ? error.message : 'Check your email for the secure sign-in link.')
  }

  async function uploadImage(event, target) {
    const file = event.target.files?.[0]
    if (!file) return
    setStatus('Uploading image…')
    const extension = file.name.split('.').pop() || 'jpg'
    const path = `${target}-${Date.now()}.${extension}`
    const { error } = await supabase.storage.from('site-images').upload(path, file, { upsert: false })
    if (error) return setStatus(error.message)
    const { data } = supabase.storage.from('site-images').getPublicUrl(path)
    if (target === 'hero') updateHero('image', data.publicUrl)
    else setContent((current) => ({
      ...current,
      features: current.features.map((feature) => feature.key === target ? { ...feature, image: data.publicUrl } : feature),
    }))
    setStatus('Image uploaded. Remember to save your changes.')
  }

  async function save() {
    setStatus('Saving…')
    const { error } = await supabase.from('site_settings').upsert({
      id: 'default', content, updated_at: new Date().toISOString(),
    })
    setStatus(error ? error.message : 'Saved. The live website has been updated.')
  }

  if (!hasSupabaseConfig) return <SetupNotice />

  if (!session) return (
    <main className="admin-shell">
      <section className="admin-card admin-login">
        <p className="admin-kicker">KISETSU EXPRESSIONS</p>
        <h1>Website editor</h1>
        <p>Sign in with the email address approved for the website.</p>
        <form onSubmit={signIn}>
          <label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <button type="submit">Send secure sign-in link</button>
        </form>
        {status && <p className="admin-status">{status}</p>}
      </section>
    </main>
  )

  if (!isAllowed) return (
    <main className="admin-shell"><section className="admin-card admin-login"><h1>Access pending</h1><p>This email has signed in, but it has not been approved as a website editor yet. Please ask the website owner to approve your account.</p></section></main>
  )

  return (
    <main className="admin-shell">
      <header className="admin-header"><a href="/">← View website</a><button type="button" className="admin-logout" onClick={() => supabase.auth.signOut()}>Sign out</button></header>
      <section className="admin-card">
        <p className="admin-kicker">PRIVATE WEBSITE EDITOR</p>
        <h1>Update the homepage</h1>
        <p>Change the main image, words, and approved design choices. Click save when you are ready to make the changes live.</p>

        <div className="admin-section"><h2>Hero section</h2>
          <label>Small heading<input value={content.hero.eyebrow} onChange={(event) => updateHero('eyebrow', event.target.value)} /></label>
          <label>Main heading<textarea value={content.hero.title} onChange={(event) => updateHero('title', event.target.value)} rows="3" /></label>
          <label>Description<textarea value={content.hero.description} onChange={(event) => updateHero('description', event.target.value)} rows="4" /></label>
          <ImageControl label="Hero image" src={content.hero.image} onChange={(event) => updateHero('image', event.target.value)} onUpload={(event) => uploadImage(event, 'hero')} />
        </div>

        <div className="admin-section"><h2>Featured images</h2>
          {content.features.map((feature) => <ImageControl key={feature.key} label={feature.title} src={feature.image} onChange={(event) => setContent((current) => ({ ...current, features: current.features.map((item) => item.key === feature.key ? { ...item, image: event.target.value } : item) }))} onUpload={(event) => uploadImage(event, feature.key)} />)}
        </div>

        <div className="admin-section"><h2>Website style</h2>
          <div className="admin-grid"><label>Main color<input type="color" value={content.theme.primaryColor} onChange={(event) => updateTheme('primaryColor', event.target.value)} /></label><label>Accent color<input type="color" value={content.theme.accentColor} onChange={(event) => updateTheme('accentColor', event.target.value)} /></label><label>Heading size<input type="range" min="70" max="130" value={content.theme.headingSize} onChange={(event) => updateTheme('headingSize', Number(event.target.value))} /><span>{content.theme.headingSize}px</span></label><label>Font<select value={content.theme.fontFamily} onChange={(event) => updateTheme('fontFamily', event.target.value)}><option value="Arial, Helvetica, sans-serif">Clean (Arial)</option><option value="Georgia, serif">Classic (Georgia)</option><option value="Trebuchet MS, sans-serif">Friendly (Trebuchet)</option></select></label></div>
        </div>
        <button className="admin-save" type="button" onClick={save}>Save and update website</button>
        {status && <p className="admin-status">{status}</p>}
      </section>
    </main>
  )
}

function ImageControl({ label, src, onChange, onUpload }) {
  return <div className="image-control"><label>{label}<input value={src} onChange={onChange} placeholder="Paste image link" /></label><img src={src} alt="Current selection" /><label className="upload-label">Or upload a new image<input type="file" accept="image/*" onChange={onUpload} /></label></div>
}

function SetupNotice() {
  return <main className="admin-shell"><section className="admin-card admin-login"><p className="admin-kicker">KISETSU EXPRESSIONS</p><h1>Editor setup is not finished</h1><p>The website editor has been added, but it still needs its Supabase connection settings before anyone can sign in.</p></section></main>
}
