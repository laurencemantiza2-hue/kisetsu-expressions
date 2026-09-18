import { useEffect, useState } from 'react'
import { useEditor } from '../EditorContext.jsx'
import { fetchPaintings, ITEM_TYPES, uploadSiteImage } from '../lib/paintings.js'
import { ADULT_SIZES, KIDS_SIZES, catalogCodes, defaultPurposeProduct } from '../lib/storefront.js'
import useDialog from './useDialog.js'

function ProductSettings({ value, onChange, builtin = false }) {
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const patch = (field, next) => onChange({ ...value, [field]: next })
  const variants = value.variants || []
  const changeVariant = (index, next) => patch('variants', variants.map((v,i) => i === index ? { ...v, ...next } : v))
  async function addPhoto(index, file) {
    if (!file) return
    setBusy(String(index)); setError('')
    try { const { url } = await uploadSiteImage(file, 'tshirts'); changeVariant(index, { images: [...(variants[index].images || []), url] }) }
    catch(e) { setError(e.message) } finally { setBusy('') }
  }
  const sizeOptions = (key, options) => <fieldset><legend>{key === 'adultSizes' ? 'Adult sizes offered' : 'Kids sizes offered'}</legend><div className="manager-checks">{options.map(size => <label key={size}><input type="checkbox" checked={(value[key] || options).includes(size)} onChange={e => patch(key, e.target.checked ? [...(value[key] || options),size] : (value[key] || options).filter(s => s !== size))} />{size}</label>)}</div></fieldset>
  return <div className="product-settings">
    {builtin && <><label><input type="checkbox" checked={value.enabled !== false} onChange={e => patch('enabled',e.target.checked)} />Show Live With Purpose in the collection</label><label>Product name<input value={value.name || ''} onChange={e => patch('name',e.target.value)} /></label><label>Description<textarea value={value.description || ''} onChange={e => patch('description',e.target.value)} /></label><label>Status<select value={value.status || 'available'} onChange={e => patch('status',e.target.value)}>{['available','reserved','sold','hidden'].map(s => <option key={s}>{s}</option>)}</select></label></>}
    <label>Product code<input value={value.number || ''} placeholder="L.P 01 or K.E 05" onChange={e => patch('number', e.target.value.toUpperCase())} /></label>
    <div className="manager-columns">{['adultPrice','kidsPrice'].map(key => <label key={key}>{key === 'adultPrice' ? 'Adult price (AED)' : 'Kids price (AED)'}<input type="number" min="0" step="0.01" value={value[key] ?? ''} placeholder="Leave blank for price inquiry" onChange={e => patch(key,e.target.value)} /></label>)}</div>
    {sizeOptions('adultSizes', ADULT_SIZES)}{sizeOptions('kidsSizes', KIDS_SIZES)}
    <label><input type="checkbox" checked={Array.isArray(value.variants)} onChange={e => patch('variants', e.target.checked ? defaultPurposeProduct.variants.map(v => ({ ...v, images:[], enabled: false })) : null)} />Enable black/white shirt and print selections</label>
    {Array.isArray(value.variants) && variants.map((v,i) => <fieldset key={v.id}><legend>{v.shirt} shirt · {v.print} print</legend><label><input type="checkbox" checked={v.enabled !== false} onChange={e => changeVariant(i,{enabled:e.target.checked})} />Offer this combination</label><div className="manager-photos">{(v.images || []).map((src,j) => <div key={src+j}><img src={src} alt={`${v.shirt} shirt, ${v.print} print`} /><button type="button" disabled={busy !== ''} onClick={() => changeVariant(i, {images:v.images.filter((_,n) => n !== j)})}>Remove photo {j+1}</button></div>)}</div><label>Add actual product photo<input type="file" accept="image/*" disabled={busy !== ''} onChange={e => addPhoto(i,e.target.files?.[0])} /></label>{busy === String(i) && <p>Uploading…</p>}</fieldset>)}
    {error && <p role="alert">{error}</p>}
  </div>
}
export default function StorefrontManager({ onClose }) {
  const { content, updateText, save, status } = useEditor()
  const ref = useDialog(onClose)
  const [rows,setRows] = useState([])
  const [loadError,setLoadError] = useState('')
  const [validation,setValidation] = useState('')
  const [selected,setSelected] = useState('purpose')
  useEffect(() => { fetchPaintings(ITEM_TYPES.TSHIRT).then(setRows).catch(e => setLoadError(e.message)) }, [])
  const settings = content.productSettings || {}
  const codes = catalogCodes(rows,settings)
  const row = rows.find(r => r.id === selected)
  const value = selected === 'purpose' ? content.purposeProduct : { adultPrice:'', kidsPrice:'', ...settings[selected], number: settings[selected]?.number || codes[selected] }
  const change = next => selected === 'purpose' ? updateText('purposeProduct',next) : updateText('productSettings',{...settings,[selected]:next})
  const reviews = content.feedback.items || []
  function reviewChange(i, patch) { updateText('feedback.items', reviews.map((r,n) => i === n ? {...r,...patch} : r)) }
  async function persist() {
    const all = [content.purposeProduct, ...rows.map(r => ({ ...settings[r.id], number:settings[r.id]?.number || codes[r.id] }))]
    const used = new Set(['K.E 01','K.E 02','K.E 03','K.E 04'])
    for (const p of all) {
      if (!/^(K\.E|L\.P) \d{2,}$/.test(p.number || '')) { setValidation('Use a code such as K.E 05 or L.P 01.'); return }
      if (used.has(p.number)) { setValidation(`Duplicate product code: ${p.number}`); return }
      used.add(p.number)
      for (const key of ['adultPrice','kidsPrice']) if (p[key] !== '' && p[key] != null && (!Number.isFinite(Number(p[key])) || Number(p[key]) < 0)) { setValidation('Prices must be positive numbers or blank.'); return }
      for (const v of p.variants || []) if (v.enabled !== false && !(v.images || []).length) { setValidation('Add a photo to each enabled combination, or disable it.'); return }
    }
    setValidation('')
    await save()
  }
  return <div className="storefront-manager-overlay" onClick={onClose}><section ref={ref} className="storefront-manager" role="dialog" aria-modal="true" aria-labelledby="storefront-manager-title" onClick={e => e.stopPropagation()}>
    <div className="manager-heading"><h2 id="storefront-manager-title">Storefront settings</h2><button onClick={onClose} aria-label="Close storefront settings">×</button></div>
    <p>Use the existing catalog manager to add products. Set their permanent codes, prices, sizes, and color options here. Save changes to publish.</p>
    <h3>Product options</h3>
    {loadError && <p role="alert">Could not load uploaded T-shirts: {loadError}</p>}
    <label>Choose product<select value={selected} onChange={e => setSelected(e.target.value)}><option value="purpose">Live With Purpose (featured)</option>{rows.map(r => <option key={r.id} value={r.id}>{codes[r.id]} — {r.title}</option>)}</select></label>
    {(selected === 'purpose' || row) && <ProductSettings key={selected} value={value} builtin={selected === 'purpose'} onChange={change} />}
    <h3>Feedback</h3>
    <p>Collect feedback through WhatsApp. Add genuine testimonials here with permission, then mark them approved for public display.</p>
    {reviews.map((r,i) => <fieldset key={r.id}><legend>Testimonial {i+1}</legend><label>Customer display name<input value={r.name} onChange={e => reviewChange(i,{name:e.target.value})} /></label><label>Feedback<textarea value={r.quote} onChange={e => reviewChange(i,{quote:e.target.value})} /></label><label><input type="checkbox" checked={!!r.approved} onChange={e => reviewChange(i,{approved:e.target.checked})} />Approved for public display</label><button onClick={() => updateText('feedback.items',reviews.filter((_,n) => n!==i))}>Remove testimonial</button></fieldset>)}
    <button onClick={() => updateText('feedback.items',[...reviews,{id:crypto.randomUUID(),name:'',quote:'',approved:false}])}>Add testimonial</button>
    <div className="manager-save"><button className="button button-primary" onClick={persist}>Save changes</button><button onClick={onClose}>Close</button><p role="status">{validation || status}</p></div>
  </section></div>
}
