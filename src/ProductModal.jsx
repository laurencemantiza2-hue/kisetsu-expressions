import { useState } from 'react'
import useDialog from './components/useDialog.js'
import {
  ADULT_SIZES,
  KIDS_SIZES,
  availableVariants,
  orderMessage,
} from './lib/storefront.js'

export default function ProductModal({ product, whatsappLink, onClose }) {
  const ref = useDialog(onClose)
  const variants = availableVariants(product)
  const hasVariants = Array.isArray(product.variants)

  const [shirt, setShirt] = useState(variants[0]?.shirt || '')
  const [print, setPrint] = useState(
    variants[0]?.print || product.printOptions?.[0]?.label || ''
  )
  const [category, setCategory] = useState('')
  const [size, setSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [photo, setPhoto] = useState(0)
  const [error, setError] = useState('')
  const [guide, setGuide] = useState(false)

  const variant = variants.find(
    (v) => v.shirt === shirt && v.print === print
  )

  const images = hasVariants
    ? variant?.images || []
    : [
        product.printOptions?.find((p) => p.label === print)?.image ||
          product.image,
      ]

  const sizes =
    category === 'Adult'
      ? product.adultSizes || ADULT_SIZES
      : category === 'Kids'
        ? product.kidsSizes || KIDS_SIZES
        : []

  const rawPrice =
    category === 'Adult'
      ? product.adultPrice
      : category === 'Kids'
        ? product.kidsPrice
        : ''

  const price =
    category &&
    rawPrice !== '' &&
    rawPrice != null &&
    Number.isFinite(Number(rawPrice))
      ? Number(rawPrice)
      : null

  const purchasable =
    !['hidden', 'sold', 'reserved'].includes(product.status) &&
    (!hasVariants || !!variant)

  const valid = !!category && !!size && purchasable

  function chooseShirt(value) {
    setShirt(value)
    setPhoto(0)

    if (!variants.some((v) => v.shirt === value && v.print === print)) {
      setPrint(variants.find((v) => v.shirt === value)?.print || '')
    }
  }

  const url =
    `${whatsappLink}?text=` +
    encodeURIComponent(
      orderMessage(product, {
        shirt,
        print,
        category,
        size,
        quantity,
        price,
      })
    )

  const choice = (label, selected, onClick, disabled = false) => (
    <button
      key={label}
      type="button"
      className={`product-choice${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  )

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div
        ref={ref}
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        <div className="product-modal-image">
          {images[photo] ? (
            <img
              src={images[photo]}
              alt={`${product.name}${
                shirt ? `, ${shirt} shirt, ${print} print` : ''
              }, view ${photo + 1}`}
            />
          ) : (
            <p className="empty-photo">Photo unavailable for this option.</p>
          )}

          {images.length > 1 && (
            <div className="product-thumbnails" aria-label="Product photos">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  aria-label={`View photo ${i + 1}`}
                  aria-pressed={photo === i}
                  onClick={() => setPhoto(i)}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-modal-details">
          <p className="product-modal-number">{product.number}</p>
          <h2 id="product-modal-title">{product.name}</h2>
          <p className="product-modal-description">{product.description}</p>

          {hasVariants && (
            <div className="product-modal-group">
              <p className="product-modal-label">T-SHIRT COLOR</p>
              <div className="product-modal-options">
                {['Black', 'White'].map((color) =>
                  choice(
                    color,
                    shirt === color,
                    () => chooseShirt(color),
                    !variants.some((v) => v.shirt === color)
                  )
                )}
              </div>
            </div>
          )}

          {(hasVariants || product.printOptions?.length > 0) && (
            <div className="product-modal-group">
              <p className="product-modal-label">PRINT COLOR</p>
              <div className="product-modal-options">
                {(hasVariants
                  ? ['White', 'Black', 'Colored']
                  : product.printOptions.map((p) => p.label)
                ).map((color) =>
                  choice(
                    color,
                    print === color,
                    () => {
                      setPrint(color)
                      setPhoto(0)
                    },
                    hasVariants &&
                      !variants.some(
                        (v) => v.shirt === shirt && v.print === color
                      )
                  )
                )}
              </div>

              {hasVariants && (
                <small>
                  Only available, contrasting combinations can be selected.
                </small>
              )}
            </div>
          )}

          <div className="product-modal-group">
            <p className="product-modal-label">SIZE CATEGORY</p>
            <div className="product-modal-options">
              {['Adult', 'Kids'].map((c) =>
                choice(c, category === c, () => {
                  setCategory(c)
                  setSize('')
                  setError('')
                })
              )}
            </div>
          </div>

          {category && (
            <div className="product-modal-group">
              <p className="product-modal-label">
                {category.toUpperCase()} SIZE
              </p>

              <div className="product-modal-options">
                {sizes.map((s) =>
                  choice(s, size === s, () => {
                    setSize(s)
                    setError('')
                  })
                )}
              </div>

              {sizes.length === 0 && (
                <p>No sizes currently available in this category.</p>
              )}

              <button
                type="button"
                className="size-guide-toggle"
                aria-expanded={guide}
                onClick={() => setGuide(!guide)}
              >
                Size guide {guide ? '−' : '+'}
              </button>

              {guide && (
                <div className="size-guide">
                  <p>
                    Measurements in centimeters. Scroll sideways to view the
                    full chart.
                  </p>
                  <div
                    tabIndex={0}
                    aria-label={`${category} size chart, scroll horizontally`}
                  >
                    <img
                      src={`/products/${
                        category === 'Adult' ? 'adult' : 'kids'
                      }-sizes.png`}
                      alt={`${category} T-shirt measurements: chest length, sleeve length, shoulder width, back length; centimeters`}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="product-modal-group">
            <p className="product-modal-label">PRICE</p>
            <p aria-live="polite">
              {!category
                ? 'Select size category'
                : price != null
                  ? `AED ${price} each · AED ${price * quantity} total`
                  : product.priceText || 'Ask us for the price'}
            </p>
          </div>

          <div className="product-modal-group">
            <p className="product-modal-label">QUANTITY</p>
            <div className="product-quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity === 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span aria-live="polite">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity === 99}
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
              >
                +
              </button>
            </div>
          </div>

          {!purchasable && (
            <p role="status">
              {product.status === 'sold'
                ? 'This item is sold.'
                : product.status === 'reserved'
                  ? 'This item is reserved.'
                  : 'This item is currently unavailable.'}
            </p>
          )}

          {error && (
            <p className="product-modal-error" role="alert">
              {error}
            </p>
          )}

          <a
            className="product-order-button"
            href={valid ? url : '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!valid}
            onClick={(e) => {
              if (!valid) {
                e.preventDefault()
                setError(
                  purchasable
                    ? 'Please select a size category and size.'
                    : 'This item is currently unavailable.'
                )
              }
            }}
          >
            INQUIRE VIA WHATSAPP →
          </a>

          <small>We’ll confirm stock, price, and delivery in our reply.</small>
        </div>
      </div>
    </div>
  )
}