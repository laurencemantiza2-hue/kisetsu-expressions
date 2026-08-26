import { useEffect, useRef, useState } from 'react'

const SIZES = ['S', 'M', 'L', 'XL']

function ProductModal({ product, whatsappLink, onClose }) {
  const printOptions = product.printOptions || []
  const closeButtonRef = useRef(null)

  const [printColor, setPrintColor] = useState(
    printOptions[0] ? printOptions[0].label : null
  )
  const [size, setSize] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const selectedPrint = printOptions.find(
    (option) => option.label === printColor
  )
  const displayImage = selectedPrint ? selectedPrint.image : product.image
  const imageAlt = printColor
    ? product.name + ' ' + printColor + ' print'
    : product.name

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function handleSizeSelect(nextSize) {
    setSize(nextSize)
    setSizeError(false)
  }

  function decreaseQuantity() {
    setQuantity((current) => (current > 1 ? current - 1 : 1))
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1)
  }

  function buildOrderMessage() {
    const lines = [
      'Hi Kisetsu Expressions! I\'m interested in ordering ' +
        product.name +
        '.',
      '',
    ]

    if (printColor) {
      lines.push('Print Color: ' + printColor)
    }

    lines.push('Size: ' + size)
    lines.push('Quantity: ' + quantity)

    return lines.join('\n')
  }

  const whatsappUrl =
    whatsappLink + '?text=' + encodeURIComponent(buildOrderMessage())

  function handleOrder(event) {
    event.stopPropagation()

    if (!size) {
      event.preventDefault()
      setSizeError(true)
    }
  }

  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="product-modal-close"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>

        <div className="product-modal-image">
          <img
            src={displayImage}
            alt={imageAlt}
          />
        </div>

        <div className="product-modal-details">
          <p className="product-modal-number">
            {product.number}
          </p>

          <h2 id="product-modal-title">
            {product.name}
          </h2>

          <p className="product-modal-description">
            {product.description}
          </p>

          {printOptions.length > 0 ? (
            <div className="product-modal-group">
              <p className="product-modal-label">
                PRINT COLOR
              </p>

              <div className="product-modal-options">
                {printOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    className={
                      'product-choice' +
                      (printColor === option.label ? ' is-selected' : '')
                    }
                    aria-pressed={printColor === option.label}
                    aria-label={option.label + ' print'}
                    onClick={() => setPrintColor(option.label)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="product-modal-group">
            <p className="product-modal-label">
              SIZE
            </p>

            <div className="product-modal-options">
              {SIZES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    'product-choice' +
                    (size === option ? ' is-selected' : '')
                  }
                  aria-pressed={size === option}
                  aria-label={'Size ' + option}
                  onClick={() => handleSizeSelect(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            {sizeError ? (
              <p className="product-modal-error" role="alert">
                Please select a size.
              </p>
            ) : null}
          </div>

          <div className="product-modal-group">
            <p className="product-modal-label">
              QUANTITY
            </p>

            <div className="product-quantity">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span aria-live="polite">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <a
            className="product-order-button"
            href={size ? whatsappUrl : '#'}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!size}
            onClick={handleOrder}
          >
            ORDER VIA WHATSAPP →
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProductModal
