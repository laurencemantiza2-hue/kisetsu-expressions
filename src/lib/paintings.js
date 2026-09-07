import { supabase } from '../supabase.js'

export async function fetchPaintings() {
  const { data, error } = await supabase
    .from('paintings')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createPainting(values) {
  const { data, error } = await supabase
    .from('paintings')
    .insert({
      title: values.title || 'Untitled painting',
      description: values.description || '',
      price_text: values.price_text || '',
      category: values.category || '',
      status: values.status || 'available',
      image_url: values.image_url || null,
      sort_order: values.sort_order ?? 0,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updatePainting(id, values) {
  const { data, error } = await supabase
    .from('paintings')
    .update(values)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePainting(id) {
  const { error } = await supabase.from('paintings').delete().eq('id', id)
  if (error) throw error
}

export async function uploadSiteImage(file, folder = 'site') {
  const extension = file.name.split('.').pop() || 'jpg'
  const path = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`
  const { error } = await supabase.storage.from('site-images').upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('site-images').getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function uploadPaintingImage(file) {
  return uploadSiteImage(file, 'paintings')
}

export async function deleteImageByUrl(url) {
  if (!url) return
  const marker = '/site-images/'
  const index = url.indexOf(marker)
  if (index === -1) return
  const path = url.slice(index + marker.length)
  await supabase.storage.from('site-images').remove([path])
}
