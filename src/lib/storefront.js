export const ADULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL']
export const KIDS_SIZES = ['22', '24', '26', '28', '30', '32', '34', '36', '38', '40']
const asset = name => `/products/${name}.png`
export const defaultPurposeProduct = {
  id: 'live-purpose-01', number: 'L.P 01', name: 'Live With Purpose — Butterfly',
  description: 'A Live With Purpose chest print and expressive butterfly artwork on the back. Choose your shirt and print colors.',
  enabled: true,
status: 'available',
adultPrice: 60,
kidsPrice: 55,
  adultSizes: ADULT_SIZES, kidsSizes: KIDS_SIZES,
  variants: [
    { id: 'white-colored', shirt: 'White', print: 'Colored', enabled: true, images: [asset('lp-white-color'), asset('lp-white-color-display'), asset('lp-white-color-lifestyle')] },
    { id: 'black-colored', shirt: 'Black', print: 'Colored', enabled: true, images: [asset('lp-black-color'), asset('lp-black-color-display'), asset('lp-black-color-lifestyle'), asset('lp-black-color-lifestyle-2')] },
    { id: 'black-white', shirt: 'Black', print: 'White', enabled: true, images: [asset('lp-black-white'), asset('lp-black-white-display'), asset('lp-black-white-lifestyle')] },
    { id: 'white-black', shirt: 'White', print: 'Black', enabled: true, images: [asset('lp-white-black'), asset('lp-white-black-display')] },
  ],
}
export function availableVariants(product) {
  return (product.variants || []).filter(v => v.enabled !== false && v.shirt && v.print && v.shirt.toLowerCase() !== v.print.toLowerCase())
}
export function collectionPrefix(name = '') {
  return /live\s+with\s+purpose/i.test(name) ? 'L.P' : 'K.E'
}
// Count every database row, including hidden rows, so visibility doesn't renumber products.
export function catalogCodes(rows, settings = {}) {
  const next = { 'K.E': 5, 'L.P': 2 }
  const used = new Set(['K.E 01','K.E 02','K.E 03','K.E 04','L.P 01'])
  for (const config of Object.values(settings)) if (config.number) used.add(config.number)
  const result = {}
  for (const row of [...rows].sort((a,b) => String(a.created_at).localeCompare(String(b.created_at)) || String(a.id).localeCompare(String(b.id)))) {
    if (settings[row.id]?.number) { result[row.id] = settings[row.id].number; continue }
    const prefix = collectionPrefix(row.title)
    let code
    do { code = `${prefix} ${String(next[prefix]++).padStart(2, '0')}` } while (used.has(code))
    used.add(code); result[row.id] = code
  }
  return result
}
export function orderMessage(product, selection) {
  const { shirt, print, category, size, quantity, price } = selection
  return [ `Hi Kisetsu Expressions! I'm interested in ${product.name}.`, `Product: ${product.number}`,
    shirt && `T-shirt color: ${shirt}`, print && `Print color: ${print}`, `Category: ${category}`,
    `Size: ${size}`, `Quantity: ${quantity}`,
    price != null ? `Price: AED ${price} each\nTotal: AED ${price * quantity}` : 'Please confirm the price.',
    'Please confirm availability.' ].filter(Boolean).join('\n')
}

export function validateStorefront(content) {
  const used = new Set(['K.E 01','K.E 02','K.E 03','K.E 04'])
  const products = [content.purposeProduct, ...Object.values(content.productSettings || {})].filter(Boolean)
  for (const product of products) {
    if (!/^(K\.E|L\.P) \d{2,}$/.test(product.number || '')) return 'Use a product code such as K.E 05 or L.P 01.'
    if (used.has(product.number)) return `Duplicate product code: ${product.number}`
    used.add(product.number)
    for (const key of ['adultPrice','kidsPrice']) {
      if (product[key] !== '' && product[key] != null && (!Number.isFinite(Number(product[key])) || Number(product[key]) < 0)) return 'Prices must be nonnegative numbers or blank.'
    }
    for (const variant of product.variants || []) {
      if (variant.enabled === false) continue
      if (variant.shirt === variant.print) return 'Shirt and print colors must contrast.'
      if (!(variant.images || []).length) return 'Add a photo to every enabled color combination, or disable it.'
    }
  }
  for (const review of content.feedback?.items || []) if (review.approved && (!review.name?.trim() || !review.quote?.trim())) return 'Approved feedback needs a display name and testimonial.'
  return ''
}
