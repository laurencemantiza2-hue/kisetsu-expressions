import { useEffect, useState } from 'react'

import './App.css'
import ProductModal from './ProductModal.jsx'

import kisetsuLogo from './assets/kisetsu-logo.png'
import magnateLogo from './assets/magnate-logo.png'

import tshirt01 from './assets/kisetsu-tshirt1.jpg'
import tshirt02 from './assets/kisetsu-tshirt2.jpg'
import tshirt03 from './assets/kisetsu-tshirt3.jpg'

import tshirt04Red from './assets/tshirt-black-red-print.jpg'
import tshirt04White from './assets/tshirt-black-white-print.jpg'
import { hasSupabaseConfig } from './supabase.js'
import { EditorProvider, useEditor } from './EditorContext.jsx'
import { EditableText, EditableImage } from './components/Editable.jsx'
import AdminChrome from './components/AdminChrome.jsx'
import PaintingEditor from './components/PaintingEditor.jsx'
import { ITEM_TYPES, fetchPaintings, uploadSiteImage } from './lib/paintings.js'


function TshirtSwapImage({ primary, altImage, name }) {
  return (
    <div className="tshirt-swap">
      <img
        src={primary}
        alt={name}
        className="tshirt-swap-primary"
      />

      <img
        src={altImage}
        alt={name + ' white print'}
        className="tshirt-swap-alt"
      />
    </div>
  )
}


function ArtworkPanel({
  type,
  artworks,
  selectedArtwork,
  onSelectArtwork,
  onClose,
  onBack,
  createWhatsappLink,
  canEdit,
  onAddArtwork,
  onEditArtwork,
  addItemLabel,
}) {
  const isSelected = Boolean(selectedArtwork)
  const title = type === 'painting' ? 'Paintings' : 'Student Art'
  const eyebrow = type === 'painting' ? 'ORIGINAL PAINTINGS' : 'STUDENT ART'
  // Editing is available for any catalog whose parent passed edit handlers,
  // not just paintings — the caller decides by passing canEdit/onAddArtwork.
  const canManage = canEdit && Boolean(onAddArtwork) && Boolean(onEditArtwork)

  const handleDeliveryChoice = (method) => {
    if (!selectedArtwork) return

    const message =
      type === 'painting'
        ? `Hello Kisetsu Expressions, I'd like to enquire about "${selectedArtwork.name}". I would prefer ${method}.`
        : `Hello Kisetsu Expressions, I'd like to enquire about "${selectedArtwork.name}". I would prefer ${method}.`

    window.open(createWhatsappLink(message), '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: 'min(1120px, 100%)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          background: 'var(--site-primary, #f5f1e8)',
          color: '#111',
          position: 'relative',
          padding: 'clamp(24px, 4vw, 56px)',
          boxShadow: '0 24px 80px rgba(0,0,0,.28)',
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 18,
            right: 20,
            border: 0,
            background: 'transparent',
            fontSize: 30,
            lineHeight: 1,
            cursor: 'pointer',
            color: 'inherit',
          }}
        >
          ×
        </button>

        {!isSelected ? (
          <>
            <p className="eyebrow">{eyebrow}</p>
            <h2 style={{ marginTop: 8, marginBottom: 10 }}>{title}</h2>
            <p style={{ maxWidth: 650, marginBottom: 32 }}>
              {type === 'painting'
                ? 'Explore the original artworks currently available from Kisetsu Expressions.'
                : 'Explore the student artworks currently being shared by Kisetsu Expressions.'}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 20,
              }}
            >
              {artworks.map((artwork) => (
                <div key={artwork.id} style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => onSelectArtwork(artwork)}
                    style={{
                      width: '100%',
                      border: '1px solid rgba(0,0,0,.12)',
                      background: '#fff',
                      padding: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#111',
                    }}
                  >
                    <div
                      style={{
                        aspectRatio: '1 / 1',
                        overflow: 'hidden',
                        background: '#eee',
                      }}
                    >
                      <img
                        src={artwork.image}
                        alt={artwork.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>

                    <div style={{ padding: '16px 16px 18px' }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          opacity: .65,
                        }}
                      >
                        {type === 'painting' ? (artwork.status && artwork.status !== 'available' ? artwork.status.toUpperCase() : 'Original Artwork') : 'Student Artwork'}
                      </p>
                      <h3 style={{ margin: '7px 0 5px', fontSize: 20 }}>
                        {artwork.name}
                      </h3>
                      <p style={{ margin: 0, opacity: .72 }}>
                        {artwork.description}
                      </p>
                    </div>
                  </button>

                  {canManage ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        onEditArtwork(artwork)
                      }}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(18,59,93,.88)',
                        color: '#fff',
                        border: 0,
                        borderRadius: 999,
                        padding: '6px 12px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  ) : null}
                </div>
              ))}

              {canManage ? (
                <button
                  type="button"
                  onClick={() => onAddArtwork()}
                  style={{
                    aspectRatio: '1 / 1',
                    border: '2px dashed rgba(18,59,93,.4)',
                    background: 'rgba(18,59,93,.04)',
                    color: '#123b5d',
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  + Add {addItemLabel || 'item'}
                </button>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={onBack}
              style={{
                border: 0,
                background: 'transparent',
                padding: 0,
                marginBottom: 24,
                cursor: 'pointer',
                fontSize: 14,
                letterSpacing: '.08em',
                textTransform: 'uppercase',
              }}
            >
              ← Back to {title}
            </button>

            {canManage ? (
              <button
                type="button"
                onClick={() => onEditArtwork(selectedArtwork)}
                style={{
                  float: 'right',
                  background: '#123b5d',
                  color: '#fff',
                  border: 0,
                  borderRadius: 999,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  marginBottom: 24,
                }}
              >
                Edit this {addItemLabel || 'item'}
              </button>
            ) : null}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.1fr) minmax(280px, .9fr)',
                gap: 'clamp(28px, 5vw, 64px)',
                alignItems: 'start',
              }}
            >
              <div style={{ background: '#fff' }}>
                <img
                  src={selectedArtwork.image}
                  alt={selectedArtwork.name}
                  style={{
                    width: '100%',
                    maxHeight: '65vh',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
              </div>

              <div>
                <p className="eyebrow">
                  {type === 'painting' ? 'ORIGINAL PAINTING' : 'STUDENT ARTWORK'}
                </p>

                <h2 style={{ margin: '8px 0 14px' }}>
                  {selectedArtwork.name}
                </h2>

                <p style={{ lineHeight: 1.7, opacity: .78 }}>
                  {selectedArtwork.description}
                </p>

                {selectedArtwork.size ? (
                  <p style={{ marginTop: 22 }}>
                    <strong>Size:</strong> {selectedArtwork.size}
                  </p>
                ) : null}

                {selectedArtwork.price ? (
                  <p style={{ marginTop: 8, fontSize: 20 }}>
                    <strong>{selectedArtwork.price}</strong>
                  </p>
                ) : null}

                <div
                  style={{
                    marginTop: 30,
                    paddingTop: 24,
                    borderTop: '1px solid rgba(0,0,0,.12)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 12,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      marginBottom: 14,
                    }}
                  >
                    How would you like to receive it?
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: 12,
                    }}
                  >
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={() => handleDeliveryChoice('Pick Up')}
                    >
                      Pick Up
                    </button>

                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => handleDeliveryChoice('Delivery')}
                    >
                      Delivery
                    </button>
                  </div>

                  <p
                    style={{
                      marginTop: 14,
                      fontSize: 13,
                      lineHeight: 1.5,
                      opacity: .65,
                    }}
                  >
                    We will confirm availability, pickup details or delivery
                    arrangements with you on WhatsApp.
                  </p>
                </div>

                <a
                  href={createWhatsappLink(
                    `Hello Kisetsu Expressions, I'd like to enquire about "${selectedArtwork.name}".`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button"
                  style={{
                    display: 'inline-block',
                    marginTop: 12,
                    width: '100%',
                    textAlign: 'center',
                  }}
                >
                  Ask About This Artwork →
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


function SiteBody() {
  const { content: siteContent, canEdit, updateText } = useEditor()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showPaintingsPanel, setShowPaintingsPanel] = useState(false)
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [showStudentArtPanel, setShowStudentArtPanel] = useState(false)
  const [selectedStudentArt, setSelectedStudentArt] = useState(null)
  const [showWorkshopPanel, setShowWorkshopPanel] = useState(false)
  const [showPromotionPopup, setShowPromotionPopup] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isFeaturePaused, setIsFeaturePaused] = useState(false)

  const [paintings, setPaintings] = useState([])
  const [editingPainting, setEditingPainting] = useState(null) // painting object, or {} for "new", or null for closed
  const [studentPaintings, setStudentPaintings] = useState([])
  const [editingStudentPainting, setEditingStudentPainting] = useState(null)
  const [tshirtProducts, setTshirtProducts] = useState([])
  const [editingTshirt, setEditingTshirt] = useState(null)
  const [heroUploading, setHeroUploading] = useState(false)
  const [featureUploading, setFeatureUploading] = useState(null)

  const whatsappLink = 'https://wa.me/971545735918'

  const facebookLink =
    'https://www.facebook.com/kisetsuexpressions/'

  const createWhatsappLink = (message) =>
    whatsappLink + '?text=' + encodeURIComponent(message)

  async function reloadPaintings() {
    if (!hasSupabaseConfig) return
    const rows = await fetchPaintings(ITEM_TYPES.PAINTING)
    setPaintings(rows)
  }

  async function reloadStudentPaintings() {
    if (!hasSupabaseConfig) return
    const rows = await fetchPaintings(ITEM_TYPES.STUDENT_PAINTING)
    setStudentPaintings(rows)
  }

  async function reloadTshirtProducts() {
    if (!hasSupabaseConfig) return
    const rows = await fetchPaintings(ITEM_TYPES.TSHIRT)
    setTshirtProducts(rows)
  }

  useEffect(() => {
    reloadPaintings()
    reloadStudentPaintings()
    reloadTshirtProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show each enabled promotion popup once per promotion ID.
  // Admin users do not receive the public promotional popup.
  useEffect(() => {
    const promotion = siteContent.promotion

    if (
      canEdit ||
      !promotion?.enabled ||
      !promotion?.showPopup ||
      !promotion?.id
    ) {
      setShowPromotionPopup(false)
      return
    }

    const dismissedPromotionId = window.localStorage.getItem(
      'kisetsu-dismissed-promotion'
    )

    if (dismissedPromotionId !== promotion.id) {
      setShowPromotionPopup(true)
    }
  }, [
    canEdit,
    siteContent.promotion?.enabled,
    siteContent.promotion?.showPopup,
    siteContent.promotion?.id,
  ])

  function closePromotionPopup() {
    const promotionId = siteContent.promotion?.id

    if (promotionId) {
      window.localStorage.setItem(
        'kisetsu-dismissed-promotion',
        promotionId
      )
    }

    setShowPromotionPopup(false)
  }

  function openPromotionDetails() {
    setShowPromotionPopup(false)
    setShowWorkshopPanel(true)
  }

  const heroImage = siteContent.hero.image

  const visiblePaintings = paintings
    .filter((painting) => canEdit || painting.status !== 'hidden')
    .map((painting) => ({
      id: painting.id,
      image: painting.image_url || siteContent.features[1].image,
      name: painting.title,
      description: painting.description,
      size: painting.category,
      price: painting.price_text,
      status: painting.status,
    }))

  const studentArt = studentPaintings
    .filter((item) => canEdit || item.status !== 'hidden')
    .map((item) => ({
      id: item.id,
      image: item.image_url || siteContent.features[2].image,
      name: item.title,
      description: item.description,
      size: item.category,
      price: item.price_text,
      status: item.status,
    }))

  const features = siteContent.features.map((feature, index) => ({
    ...feature,
    index,
    imageAlt: feature.title,
  }))

  useEffect(() => {
    if (isFeaturePaused) return undefined

    const timer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [features.length, isFeaturePaused])

  async function handleHeroUpload(file) {
    setHeroUploading(true)
    try {
      const { url } = await uploadSiteImage(file, 'hero')
      updateText('hero.image', url)
    } finally {
      setHeroUploading(false)
    }
  }

  async function handleFeatureUpload(index, file) {
    setFeatureUploading(index)
    try {
      const { url } = await uploadSiteImage(file, 'features')
      updateText(`features.${index}.image`, url)
    } finally {
      setFeatureUploading(null)
    }
  }


  const staticTshirts = [
    {
      number: '01',
      image: tshirt01,
      name: 'Kisetsu T-Shirt 01',
      description:
        'A creative expression designed for everyday wear.',
    },

    {
      number: '02',
      image: tshirt02,
      name: 'Kisetsu T-Shirt 02',
      description:
        'A unique design created to express your personality.',
    },

    {
      number: '03',
      image: tshirt03,
      name: 'Kisetsu T-Shirt 03',
      description:
        'Wear your story with a design made to stand out.',
    },

    {
      number: '04',
      image: tshirt04Red,
      hoverImage: tshirt04White,
      name: 'Kisetsu T-Shirt 04',
      description:
        'A black tee with a bold print — red or white, same design.',

      printOptions: [
        {
          label: 'Red',
          image: tshirt04Red,
        },
        {
          label: 'White',
          image: tshirt04White,
        },
      ],
    },
  ]

  // T-shirts added through the admin dashboard are appended after the
  // original four static designs above, which keep their existing
  // hover/print-color behaviour untouched.
  const dynamicTshirts = tshirtProducts
  .filter((item) => canEdit || item.status !== 'hidden')
  .map((item, index) => ({
    id: item.id,
    number: String(staticTshirts.length + index + 1).padStart(2, '0'),
    image: item.image_url || tshirt01,
    name: item.title,
    description: item.description,
    priceText: item.price_text,
    category: item.category,
    status: item.status,
    isDynamic: true,
    raw: item,
  }))

  const tshirts = [...staticTshirts, ...dynamicTshirts]


  function openProductModal(shirt) {
    setSelectedProduct(shirt)
  }


  return (
    <div
      className="website"
      style={{
        '--site-primary': siteContent.theme.primaryColor,
        '--site-accent': siteContent.theme.accentColor,
        '--hero-heading-size': `${siteContent.theme.headingSize}px`,
        '--site-font': siteContent.theme.fontFamily,
      }}
    >

      {/* =========================
          NAVIGATION
      ========================== */}

      <header className="navbar">

        <a
          href="#home"
          className="nav-logo"
        >
          <img
            src={kisetsuLogo}
            alt="Kisetsu Expressions"
          />
        </a>


        <nav className="nav-links">

          <a href="#home">
            Home
          </a>

          <a href="#about">
            About
          </a>

          <a href="#tshirts">
            T-Shirts
          </a>

          <a href="#paintings">
            Paintings
          </a>

          <a href="#workshops">
            Workshops
          </a>

          <a href="#contact">
            Contact
          </a>

        </nav>


        <a
  href={whatsappLink}
  target="_blank"
  rel="noopener noreferrer"
  className="nav-contact nav-whatsapp-icon"
  aria-label="Contact Kisetsu Expressions on WhatsApp"
  title="WhatsApp"
>
  <svg
    viewBox="0 0 32 32"
    width="28"
    height="28"
    aria-hidden="true"
    focusable="false"
  >
    <path
  fill="#25D366"
      d="M16.04 3C9.4 3 4 8.36 4 14.96c0 2.62.86 5.05 2.32 7.02L4.8 27.5l5.68-1.49a12.08 12.08 0 0 0 5.55 1.39h.01C22.68 27.4 28 22.04 28 15.44 28 8.84 22.68 3 16.04 3Zm0 22.36h-.01a10.03 10.03 0 0 1-5.12-1.4l-.37-.22-3.37.88.9-3.28-.24-.38a9.9 9.9 0 0 1-1.53-5.3c0-5.48 4.47-9.94 9.97-9.94 5.5 0 9.96 4.46 9.96 9.94 0 5.49-4.46 9.7-10.19 9.7Zm5.47-7.46c-.3-.15-1.76-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.05c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.07 2.87 1.22 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.11.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"
    />
  </svg>
</a>
      </header>


      <main>

        {/* =========================
            HERO
        ========================== */}

        <section
          id="home"
          className="hero-section"
          style={{ '--hero-image': `url(${heroImage})` }}
        >

          {canEdit ? (
            <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <EditableImage
                src={heroImage}
                alt="Hero background"
                imgStyle={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}
                onUpload={handleHeroUpload}
                uploading={heroUploading}
              />
            </div>
          ) : null}

          <div className="hero-content" style={{ position: 'relative', zIndex: 2 }}>

            <EditableText path="hero.eyebrow" as="p" className="eyebrow" />

            <EditableText path="hero.title" as="h1" preLine />

            <EditableText path="hero.description" as="p" className="hero-description" />


            <div className="hero-buttons">

              <a
                href="#discover"
                className="button button-primary"
              >
                Explore Kisetsu
              </a>


              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-secondary"
              >
                Talk to Us
              </a>

            </div>

          </div>

        </section>


        {/* =========================
            CURRENT PROMOTION
        ========================== */}

        {siteContent.promotion?.enabled &&
        siteContent.promotion?.showOnHomepage ? (
          <section
            className="promotion-section"
            style={{
              padding: 'clamp(48px, 7vw, 90px) clamp(20px, 5vw, 72px)',
              background: '#f5f1e8',
            }}
          >
            <div
              style={{
                width: 'min(1180px, 100%)',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: siteContent.promotion.image
                  ? 'minmax(280px, .9fr) minmax(0, 1.1fr)'
                  : '1fr',
                gap: 'clamp(32px, 6vw, 80px)',
                alignItems: 'center',
              }}
            >
              {siteContent.promotion.image ? (
                <div
                  style={{
                    overflow: 'hidden',
                    background: '#fff',
                    boxShadow: '0 20px 60px rgba(0,0,0,.12)',
                  }}
                >
                  <img
                    src={siteContent.promotion.image}
                    alt={siteContent.promotion.title || 'Kisetsu Expressions promotion'}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              ) : null}

              <div>
                <p className="eyebrow">WHAT'S HAPPENING AT KISETSU</p>
                <h2 style={{ margin: '10px 0 18px', maxWidth: 700 }}>
                  {siteContent.promotion.title}
                </h2>
                <p style={{ maxWidth: 650, lineHeight: 1.75, opacity: 0.78, marginBottom: 26 }}>
                  {siteContent.promotion.description}
                </p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => setShowWorkshopPanel(true)}
                >
                  {siteContent.promotion.buttonLabel || 'Learn More'}
                </button>
              </div>
            </div>
          </section>
        ) : null}


        {/* =========================
            FEATURED EXPRESSIONS
        ========================== */}

        <section id="discover" className="discover-section">

          <div className="discover-header">
            <div>
              <EditableText path="discover.eyebrow" as="p" className="eyebrow" />
              <EditableText path="discover.heading" as="h2" preLine />
            </div>

            <button
              type="button"
              className="carousel-pause"
              onClick={() => setIsFeaturePaused((paused) => !paused)}
              aria-pressed={isFeaturePaused}
            >
              {isFeaturePaused ? 'Play slides' : 'Pause slides'}
            </button>
          </div>

          <div className="feature-carousel" aria-label="Kisetsu Expressions offerings">
            <div
              className="feature-track"
              style={{ transform: `translateX(-${activeFeature * 100}%)` }}
            >
              {features.map((feature) => (
                <article className="feature-slide" key={feature.key}>
                  <EditableImage
                    src={feature.image}
                    alt={feature.imageAlt}
                    imgStyle={{ width: '100%', height: '100%', minHeight: 550, objectFit: 'cover' }}
                    onUpload={(file) => handleFeatureUpload(feature.index, file)}
                    uploading={featureUploading === feature.index}
                  />
                  <div className="feature-slide-content">
                    <p className="eyebrow">KISETSU {feature.title.toUpperCase()}</p>
                    <EditableText path={`features.${feature.index}.title`} as="h3" />
                    <EditableText path={`features.${feature.index}.description`} as="p" />
                    <a href={feature.href} className="button button-primary">
                      {feature.action}
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="carousel-controls">
              <button
                type="button"
                className="carousel-arrow"
                onClick={() => setActiveFeature((current) => (current - 1 + features.length) % features.length)}
                aria-label="Show previous feature"
              >
                ←
              </button>

              <div className="carousel-dots">
                {features.map((feature, index) => (
                  <button
                    type="button"
                    key={feature.key}
                    className={index === activeFeature ? 'is-active' : ''}
                    onClick={() => setActiveFeature(index)}
                    aria-label={`Show ${feature.title}`}
                    aria-current={index === activeFeature ? 'true' : undefined}
                  />
                ))}
              </div>

              <button
                type="button"
                className="carousel-arrow"
                onClick={() => setActiveFeature((current) => (current + 1) % features.length)}
                aria-label="Show next feature"
              >
                →
              </button>
            </div>
          </div>

        </section>


        {/* =========================
            INTRODUCTION
        ========================== */}

        <section className="intro-section">

          <div className="intro-content">

            <EditableText path="intro.eyebrow" as="p" className="eyebrow" />

            <EditableText path="intro.heading" as="h2" preLine />

            <EditableText path="intro.paragraph" as="p" />

          </div>

        </section>


        {/* =========================
            PAINTINGS
        ========================== */}

        <section id="paintings" className="expression-section paintings-section">
          <div className="expression-image">
            <EditableImage
              src={siteContent.features[1].image}
              alt="Original Kisetsu painting displayed in a home"
              onUpload={(file) => handleFeatureUpload(1, file)}
              uploading={featureUploading === 1}
            />
          </div>

          <div className="expression-content">
            <EditableText path="paintingsSection.eyebrow" as="p" className="eyebrow" />
            <EditableText path="paintingsSection.heading" as="h2" preLine />
            <EditableText path="paintingsSection.description" as="p" />
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                setSelectedPainting(null)
                setShowPaintingsPanel(true)
              }}
            >
              {siteContent.paintingsSection.buttonLabel}
            </button>
          </div>
        </section>


        {/* =========================
            STUDENT ART
        ========================== */}

        <section id="student-art" className="expression-section student-art-section">
          <div className="expression-content">
            <EditableText path="studentArtSection.eyebrow" as="p" className="eyebrow" />
            <EditableText path="studentArtSection.heading" as="h2" preLine />
            <EditableText path="studentArtSection.description" as="p" />
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setSelectedStudentArt(null)
                setShowStudentArtPanel(true)
              }}
            >
              {siteContent.studentArtSection.buttonLabel}
            </button>
          </div>

          <div className="expression-image">
            <EditableImage
              src={siteContent.features[2].image}
              alt="Student holding a completed painting"
              onUpload={(file) => handleFeatureUpload(2, file)}
              uploading={featureUploading === 2}
            />
          </div>
        </section>


        {/* =========================
            WORKSHOPS
        ========================== */}

        <section id="workshops" className="workshops-section">
          <div className="workshops-image">
            <EditableImage
              src={siteContent.features[3].image}
              alt="Students creating art together in a workshop"
              onUpload={(file) => handleFeatureUpload(3, file)}
              uploading={featureUploading === 3}
            />
          </div>

          <div className="workshops-content">
            <EditableText path="workshopsSection.eyebrow" as="p" className="eyebrow" />
            <EditableText path="workshopsSection.heading" as="h2" preLine />
            <EditableText path="workshopsSection.description" as="p" />
            <button
              type="button"
              className="button button-light"
              onClick={() => setShowWorkshopPanel(true)}
            >
              Plan Your Creative Workshop
            </button>
          </div>
        </section>


        {/* =========================
            ABOUT
        ========================== */}

        <section
          id="about"
          className="about-section"
        >

          <div className="section-label">
            ABOUT KISETSU
          </div>


          <div className="about-grid">

            <div className="about-heading">

              <EditableText path="about.heading" as="h2" preLine />

            </div>


            <div className="about-text">

              <EditableText path="about.paragraph1" as="p" />

              <EditableText path="about.paragraph2" as="p" />

              <EditableText path="about.paragraph3" as="p" />

            </div>

          </div>

        </section>


        {/* =========================
            T-SHIRT COLLECTION
        ========================== */}

        <section
          id="tshirts"
          className="tshirts-section"
        >

          <div className="services-header">

            <EditableText path="tshirtsSection.eyebrow" as="p" className="eyebrow" />

            <EditableText path="tshirtsSection.heading" as="h2" preLine />

          </div>


          <div className="tshirt-grid">

            {tshirts.map((shirt) => (

              <article
                className="tshirt-card tshirt-card-interactive"
                key={shirt.number}
              >

                <div
                  className="tshirt-image"
                  onClick={() => openProductModal(shirt)}
                >

                  {shirt.hoverImage ? (

                    <TshirtSwapImage
                      primary={shirt.image}
                      altImage={shirt.hoverImage}
                      name={shirt.name}
                    />

                  ) : (

                    <img
                      src={shirt.image}
                      alt={shirt.name}
                    />

                  )}

                  {canEdit && shirt.isDynamic ? (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setEditingTshirt(shirt.raw)
                      }}
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(18,59,93,.88)',
                        color: '#fff',
                        border: 0,
                        borderRadius: 999,
                        padding: '6px 12px',
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                  ) : null}

                </div>


                <div className="tshirt-info">

                  <div>

                    <span className="service-number">
                      {shirt.number}
                    </span>


                    <h3>
                      {shirt.name}
                    </h3>


                    <p>
                      {shirt.description}
                    </p>

                  </div>


                  <button
                    type="button"
                    className="tshirt-order-trigger"
                    onClick={() => openProductModal(shirt)}
                  >
                    Order via WhatsApp →
                  </button>

                </div>

              </article>

            ))}

            {canEdit ? (
              <button
                type="button"
                onClick={() => setEditingTshirt({})}
                className="tshirt-card"
                style={{
                  border: '2px dashed rgba(18,59,93,.4)',
                  background: 'rgba(18,59,93,.04)',
                  color: '#123b5d',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                }}
              >
                + Add T-shirt
              </button>
            ) : null}

          </div>

        </section>


        {/* =========================
            CALL TO ACTION
        ========================== */}

        <section className="cta-section">

          <div className="cta-content">

            <EditableText path="cta.eyebrow" as="p" className="eyebrow" />

            <EditableText path="cta.heading" as="h2" preLine />

            <EditableText path="cta.description" as="p" />


            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-light"
            >
              Message Us on WhatsApp
            </a>

          </div>

        </section>


        {/* =========================
            CONTACT
        ========================== */}

        <section
          id="contact"
          className="contact-section"
        >

          <div className="section-label">
            GET IN TOUCH
          </div>


          <div className="contact-grid">

            <div>

              <EditableText path="contact.heading" as="h2" preLine />

            </div>


            <div className="contact-details">

              <div className="contact-item">

                <span>
                  WHATSAPP
                </span>


                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +971 54 573 5918
                </a>

              </div>


              <div className="contact-item">

                <span>
                  FACEBOOK
                </span>


                <a
                  href={facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Kisetsu Expressions
                </a>

              </div>


              <div className="contact-item">

                <span>
                  LOCATION
                </span>


                <p>
                  United Arab Emirates
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="footer">

        <div className="footer-main">

          <div className="footer-brand">

            <img
              src={kisetsuLogo}
              alt="Kisetsu Expressions"
            />


            <p>
              Your Story, Beautifully Gifted.
            </p>

          </div>


          <div className="footer-links">

            <div>

              <h4>
                NAVIGATE
              </h4>


              <a href="#home">
                Home
              </a>


              <a href="#about">
                About
              </a>


              <a href="#tshirts">
                T-Shirts
              </a>


              <a href="#contact">
                Contact
              </a>

            </div>


            <div>

              <h4>
                CONNECT
              </h4>


              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>


              <a
                href={facebookLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>

            </div>

          </div>

        </div>


        {/* =========================
            POWERED BY MAGNATE
        ========================== */}

        <div className="powered-by">

          <div className="powered-line"></div>


          <div className="powered-content">

            <span className="powered-kisetsu">
              KISETSU
            </span>


            <span className="powered-text">
              POWERED BY
            </span>


            <img
              src={magnateLogo}
              alt="Magnate eBiz"
              className="magnate-logo"
            />

          </div>


          <div className="powered-line"></div>

        </div>


        {/* =========================
            FOOTER BOTTOM
        ========================== */}

        <div className="footer-bottom">

          <p>
            © 2026 Kisetsu Expressions.
            All rights reserved.
          </p>


          <p>
            Powered by Magnate
          </p>

        </div>

      </footer>


      {/* =========================
          PAINTINGS PANEL
      ========================== */}

      {showPaintingsPanel ? (
        <ArtworkPanel
          type="painting"
          artworks={visiblePaintings}
          canEdit={canEdit}
          addItemLabel="painting"
          onAddArtwork={() => setEditingPainting({})}
          onEditArtwork={(artwork) => setEditingPainting(paintings.find((item) => item.id === artwork.id) || {})}
          selectedArtwork={selectedPainting}
          onSelectArtwork={setSelectedPainting}
          onClose={() => {
            setShowPaintingsPanel(false)
            setSelectedPainting(null)
          }}
          onBack={() => setSelectedPainting(null)}
          createWhatsappLink={createWhatsappLink}
        />
      ) : null}

      {/* =========================
          STUDENT ART PANEL
      ========================== */}

      {showStudentArtPanel ? (
        <ArtworkPanel
          type="student"
          artworks={studentArt}
          canEdit={canEdit}
          addItemLabel="student painting"
          onAddArtwork={() => setEditingStudentPainting({})}
          onEditArtwork={(artwork) => setEditingStudentPainting(studentPaintings.find((item) => item.id === artwork.id) || {})}
          selectedArtwork={selectedStudentArt}
          onSelectArtwork={setSelectedStudentArt}
          onClose={() => {
            setShowStudentArtPanel(false)
            setSelectedStudentArt(null)
          }}
          onBack={() => setSelectedStudentArt(null)}
          createWhatsappLink={createWhatsappLink}
        />
      ) : null}

      {/* =========================
          PROMOTION POPUP
      ========================== */}

      {showPromotionPopup &&
      siteContent.promotion?.enabled &&
      siteContent.promotion?.showPopup ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={siteContent.promotion.title || 'Current promotion'}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2200,
            background: 'rgba(0, 0, 0, 0.78)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            overflowY: 'auto',
          }}
          onClick={closePromotionPopup}
        >
          <div
            style={{
              width: 'min(620px, 100%)',
              maxHeight: 'calc(100vh - 40px)',
              overflowY: 'auto',
              position: 'relative',
              background: '#fff',
              color: '#111',
              boxShadow: '0 24px 90px rgba(0,0,0,.4)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePromotionPopup}
              aria-label="Close promotion"
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                zIndex: 2,
                width: 42,
                height: 42,
                border: 0,
                borderRadius: '50%',
                background: 'rgba(0,0,0,.72)',
                color: '#fff',
                fontSize: 26,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            {siteContent.promotion.image ? (
              <img
                src={siteContent.promotion.image}
                alt={siteContent.promotion.title || 'Kisetsu Expressions promotion'}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '70vh',
                  objectFit: 'contain',
                  background: '#f5f1e8',
                }}
              />
            ) : null}

            <div style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
              <p className="eyebrow">KISETSU EXPRESSIONS</p>
              <h2 style={{ margin: '8px 0 14px' }}>
                {siteContent.promotion.title}
              </h2>
              <p style={{ lineHeight: 1.7, opacity: 0.76, marginBottom: 24 }}>
                {siteContent.promotion.description}
              </p>
              <button
                type="button"
                className="button button-primary"
                onClick={openPromotionDetails}
              >
                {siteContent.promotion.buttonLabel || 'Learn More'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================
          WORKSHOP PANEL
      ========================== */}

      {showWorkshopPanel ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Creative Workshops"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2100,
            background: 'rgba(0, 0, 0, 0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            overflowY: 'auto',
          }}
          onClick={() => setShowWorkshopPanel(false)}
        >
          <div
            style={{
              width: 'min(760px, 100%)',
              maxHeight: 'calc(100vh - 48px)',
              overflowY: 'auto',
              background: 'var(--site-primary, #123b5d)',
              color: '#fff',
              position: 'relative',
              padding: 'clamp(28px, 5vw, 56px)',
              boxShadow: '0 24px 80px rgba(0,0,0,.3)',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowWorkshopPanel(false)}
              aria-label="Close workshop information"
              style={{
                position: 'absolute',
                top: 18,
                right: 20,
                border: 0,
                background: 'transparent',
                color: '#fff',
                fontSize: 30,
                lineHeight: 1,
                cursor: 'pointer',
              }}
            >
              ×
            </button>

            <p className="eyebrow">CREATIVE WORKSHOPS</p>
            <h2 style={{ margin: '8px 0 18px' }}>Make something meaningful together.</h2>
            <p style={{ lineHeight: 1.75, opacity: 0.9 }}>
              Bring your group together for a fun, creative experience designed to encourage imagination, self-expression, and connection through art.
            </p>
            <p style={{ lineHeight: 1.75, opacity: 0.9 }}>
              Whether you are planning an activity for children, a group, a special occasion, or a creative gathering, Kisetsu Expressions can help shape an enjoyable hands-on experience.
            </p>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.25)' }}>
              <h3 style={{ marginBottom: 16 }}>What to expect</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                🎨 Create — explore drawing, painting, and artistic activities<br />
                💡 Explore — discover new ideas and creative techniques<br />
                ✨ Express — turn imagination into something personal<br />
                😊 Enjoy — share a relaxed and memorable creative experience
              </p>
            </div>

            <div style={{ marginTop: 28, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,.25)' }}>
              <h3 style={{ marginBottom: 10 }}>Interested in a workshop?</h3>
              <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
                Contact us to discuss your ideas and find out how we can plan a creative session for your group.
              </p>
              <p style={{ marginTop: 14, fontWeight: 700 }}>Call / WhatsApp: +971 54 573 5918</p>
              <a
                href={createWhatsappLink('Hello Kisetsu Expressions, I would like to know more about your creative workshops.')}
                target="_blank"
                rel="noopener noreferrer"
                className="button button-light"
                style={{ display: 'inline-block', marginTop: 12 }}
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      ) : null}

      {/* =========================
          PRODUCT MODAL
      ========================== */}

      {selectedProduct ? (

        <ProductModal
          key={selectedProduct.number}
          product={selectedProduct}
          whatsappLink={whatsappLink}
          onClose={() => setSelectedProduct(null)}
        />

      ) : null}

      {/* =========================
          PAINTING EDITOR (admin only)
      ========================== */}

      {editingPainting ? (
        <PaintingEditor
          painting={editingPainting.id ? editingPainting : null}
          itemType={ITEM_TYPES.PAINTING}
          onClose={() => setEditingPainting(null)}
          onSaved={() => {
            setEditingPainting(null)
            reloadPaintings()
          }}
          onDeleted={() => {
            setEditingPainting(null)
            if (selectedPainting) setSelectedPainting(null)
            reloadPaintings()
          }}
        />
      ) : null}

      {/* =========================
          STUDENT PAINTING EDITOR (admin only)
      ========================== */}

      {editingStudentPainting ? (
        <PaintingEditor
          painting={editingStudentPainting.id ? editingStudentPainting : null}
          itemType={ITEM_TYPES.STUDENT_PAINTING}
          onClose={() => setEditingStudentPainting(null)}
          onSaved={() => {
            setEditingStudentPainting(null)
            reloadStudentPaintings()
          }}
          onDeleted={() => {
            setEditingStudentPainting(null)
            if (selectedStudentArt) setSelectedStudentArt(null)
            reloadStudentPaintings()
          }}
        />
      ) : null}

      {/* =========================
          T-SHIRT EDITOR (admin only)
      ========================== */}

      {editingTshirt ? (
        <PaintingEditor
          painting={editingTshirt.id ? editingTshirt : null}
          itemType={ITEM_TYPES.TSHIRT}
          onClose={() => setEditingTshirt(null)}
          onSaved={() => {
            setEditingTshirt(null)
            reloadTshirtProducts()
          }}
          onDeleted={() => {
            setEditingTshirt(null)
            reloadTshirtProducts()
          }}
        />
      ) : null}

    </div>
  )
}

export default function App({ adminMode = false }) {
  return (
    <EditorProvider adminMode={adminMode}>
      <AdminChrome adminMode={adminMode} />
      <SiteBody />
    </EditorProvider>
  )
}
