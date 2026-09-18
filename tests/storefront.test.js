import test from 'node:test'
import assert from 'node:assert/strict'
import { availableVariants, defaultPurposeProduct, catalogCodes, orderMessage } from '../src/lib/storefront.js'

test('only the four photographed color combinations are available', () => {
  assert.deepEqual(availableVariants(defaultPurposeProduct).map(v => [v.shirt,v.print]), [['White','Colored'],['Black','Colored'],['Black','White'],['White','Black']])
  assert.equal(availableVariants({ variants:[{shirt:'Black',print:'Black'}, {shirt:'White',print:'White'}, {shirt:'Black',print:'White',enabled:false}] }).length,0)
})
test('codes stay with products across sorting and hidden items; saved deleted codes stay reserved', () => {
  const rows=[{id:'a',title:'Kisetsu',created_at:'2026-01-01'}, {id:'b',title:'Live With Purpose',created_at:'2026-01-02'}, {id:'c',title:'Kisetsu',created_at:'2026-01-03',status:'hidden'}]
  const codes=catalogCodes(rows)
  assert.deepEqual(codes,{a:'K.E 05',b:'L.P 02',c:'K.E 06'})
  assert.deepEqual(catalogCodes([...rows].reverse()),codes)
  const saved=Object.fromEntries(Object.entries(codes).map(([id,number])=>[id,{number}]))
  assert.equal(catalogCodes([{id:'d',title:'Kisetsu',created_at:'2026-01-04'}],saved).d,'K.E 07')
})
test('WhatsApp inquiry includes complete selection and does not invent unknown prices', () => {
  const message=orderMessage(defaultPurposeProduct,{shirt:'Black',print:'White',category:'Kids',size:'28',quantity:2,price:null})
  for (const fragment of ['Product: L.P 01','T-shirt color: Black','Print color: White','Kids','Size: 28','Quantity: 2','Please confirm the price.']) assert.ok(message.includes(fragment))
  assert.ok(!message.includes('Total:'))
  assert.ok(orderMessage(defaultPurposeProduct,{category:'Adult',size:'M',quantity:2,price:60}).includes('Total: AED 120'))
})
