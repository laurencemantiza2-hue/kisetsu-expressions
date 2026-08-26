import { useEffect, useRef, useState } from 'react'

const ADULT_SIZES = ['S', 'M', 'L', 'XL']

const KIDS_SIZES = [
  '4–5 years',
  '6–7 years',
  '8–9 years',
  '10–11 years',
]

const ADULT_PRICE = 60
const KIDS_PRICE = 55

function ProductModal({ product, whatsappLink, onClose }) {
  const printOptions = product.printOptions || []

  const closeButtonRef = useRef(null)

  const [printColor, setPrintColor] = useState(
    printOptions[0] ? printOptions[0].label : null
  )

  const [size, setSize] = useState(null)
  const [category, setCategory] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [sizeError, setSizeError] = useState(false)

  const selectedPrint = printOptions.find(
    (option) => option.label === printColor
  )

  const displayImage = selectedPrint
    ? selectedPrint.image
    : product.image

  const imageAlt = printColor
    ? product.name + ' ' + printColor + ' print'
    : product.name

  const price =
    category === 'Kids'
      ? KIDS_PRICE
      : category === 'Adult'
        ? ADULT_PRICE
        : null


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


  function handleCategorySelect(nextCategory) {
    setCategory(nextCategory)
    setSize(null)
    setSizeError(false)
  }


  function handleSizeSelect(nextSize) {
    setSize(nextSize)
    setSizeError(false)
  }


  function decreaseQuantity() {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    )
  }


  function increaseQuantity() {
    setQuantity((current) => current + 1)
  }


  function buildOrderMessage() {
    const lines = [
      "Hi Kisetsu Expressions! I'm interested in ordering " +
        product.name +
        '.',
      '',
    ]

    if (printColor) {
      lines.push('Print Color: ' + printColor)
    }

    lines.push('Category: ' + category)
    lines.push('Size: ' + size)
    lines.push('Quantity: ' + quantity)
    lines.push('Price: AED ' + price + ' each')
    lines.push(
      'Total: AED ' + price * quantity
    )

    return lines.join('\n')
  }


  const whatsappUrl =
    whatsappLink +
    '?text=' +
    encodeURIComponent(buildOrderMessage())


  function handleOrder(event) {
    event.stopPropagation()

    if (!category || !size) {
      event.preventDefault()
      setSizeError(true)
    }
  }


  const availableSizes =
    category === 'Kids'
      ? KIDS_SIZES
      : category === 'Adult'
        ? ADULT_SIZES
        : []


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


          {/* PRINT COLOR */}

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
                      (
                        printColor === option.label
                          ? ' is-selected'
                          : ''
                      )
                    }
                    aria-pressed={
                      printColor === option.label
                    }
                    onClick={() =>
                      setPrintColor(option.label)
                    }
                  >
                    {option.label}
                  </button>

                ))}

              </div>

            </div>

          ) : null}


          {/* CATEGORY */}

          <div className="product-modal-group">

            <p className="product-modal-label">
              SIZE CATEGORY
            </p>


            <div className="product-modal-options">

              <button
                type="button"
                className={
                  'product-choice' +
                  (
                    category === 'Adult'
                      ? ' is-selected'
                      : ''
                  )
                }
                aria-pressed={category === 'Adult'}
                onClick={() =>
                  handleCategorySelect('Adult')
                }
              >
                Adult
              </button>


              <button
                type="button"
                className={
                  'product-choice' +
                  (
                    category === 'Kids'
                      ? ' is-selected'
                      : ''
                  )
                }
                aria-pressed={category === 'Kids'}
                onClick={() =>
                  handleCategorySelect('Kids')
                }
              >
                Kids
              </button>

            </div>

          </div>


          {/* PRICE */}

          <div className="product-modal-group">

            <p className="product-modal-label">
              PRICE
            </p>


            <p
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 800,
                color: '#123b5d',
              }}
            >
              {price
                ? `AED ${price}`
                : 'Select a size category'}
            </p>

          </div>


          {/* SIZE */}

          {category ? (

            <div className="product-modal-group">

              <p className="product-modal-label">
                {category === 'Kids'
                  ? 'KIDS SIZE'
                  : 'ADULT SIZE'}
              </p>


              <div className="product-modal-options">

                {availableSizes.map((option) => (

                  <button
                    key={option}
                    type="button"
                    className={
                      'product-choice' +
                      (
                        size === option
                          ? ' is-selected'
                          : ''
                      )
                    }
                    aria-pressed={size === option}
                    onClick={() =>
                      handleSizeSelect(option)
                    }
                  >
                    {option}
                  </button>

                ))}

              </div>


              {sizeError ? (

                <p
                  className="product-modal-error"
                  role="alert"
                >
                  Please select a size category and size.
                </p>

              ) : null}

            </div>

          ) : null}


          {/* QUANTITY */}

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


          {/* WHATSAPP */}

          <a
            className="product-order-button"
            href={
              category && size
                ? whatsappUrl
                : '#'
            }
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!category || !size}
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