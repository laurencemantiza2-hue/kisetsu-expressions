import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { hasSupabaseConfig, supabase } from './supabase.js'
import { defaultSiteContent, mergeSiteContent, getByPath, setByPath } from './siteContent.js'

const EditorContext = createContext(null)

export function EditorProvider({ adminMode, children }) {
  const [content, setContent] = useState(defaultSiteContent)
  const [contentLoaded, setContentLoaded] = useState(false)
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)
  const [status, setStatus] = useState('')
  const [dirty, setDirty] = useState(false)
  const [mode, setMode] = useState('text') // 'text' | 'style'
  const [stylePanelPath, setStylePanelPath] = useState(null)

  // Public site content loads for everyone, admin or not.
  useEffect(() => {
    let active = true
    if (!hasSupabaseConfig) {
      setContentLoaded(true)
      return undefined
    }
    supabase
      .from('site_settings')
      .select('content')
      .eq('id', 'default')
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.content) setContent(mergeSiteContent(data.content))
        setContentLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  // Auth only matters on /admin.
  useEffect(() => {
    if (!adminMode || !hasSupabaseConfig) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [adminMode])

  useEffect(() => {
    if (!adminMode || !session || !hasSupabaseConfig) {
      setIsAdmin(false)
      return undefined
    }
    let active = true
    setCheckingAdmin(true)
    supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) {
          setIsAdmin(Boolean(data))
          setCheckingAdmin(false)
        }
      })
    return () => {
      active = false
    }
  }, [adminMode, session])

  const canEdit = adminMode && isAdmin

  const updateText = useCallback((path, value) => {
    setContent((current) => setByPath(current, path, value))
    setDirty(true)
  }, [])

  const updateStyle = useCallback((path, patch) => {
    setContent((current) => {
      const currentStyle = getByPath(current, `styles.${path}`) || {}
      const nextStyle = { ...currentStyle, ...patch }
      return setByPath(current, `styles.${path}`, nextStyle)
    })
    setDirty(true)
  }, [])

  const clearStyle = useCallback((path) => {
    setContent((current) => setByPath(current, `styles.${path}`, {}))
    setDirty(true)
  }, [])

  const save = useCallback(async () => {
    if (!hasSupabaseConfig) return
    setStatus('Saving…')
    const { error } = await supabase.from('site_settings').upsert({
      id: 'default',
      content,
      updated_at: new Date().toISOString(),
    })
    if (error) setStatus(error.message)
    else {
      setStatus('Saved. The live website has been updated.')
      setDirty(false)
    }
  }, [content])

  const signIn = useCallback(async (email) => {
    setStatus('')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    setStatus(error ? error.message : 'Check your email for the secure sign-in link.')
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo(() => ({
    content,
    setContent,
    contentLoaded,
    canEdit,
    adminMode,
    session,
    isAdmin,
    checkingAdmin,
    status,
    setStatus,
    dirty,
    mode,
    setMode,
    stylePanelPath,
    setStylePanelPath,
    updateText,
    updateStyle,
    clearStyle,
    save,
    signIn,
    signOut,
  }), [content, contentLoaded, canEdit, adminMode, session, isAdmin, checkingAdmin, status, dirty, mode, stylePanelPath, updateText, updateStyle, clearStyle, save, signIn, signOut])

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error('useEditor must be used within an EditorProvider')
  return ctx
}
