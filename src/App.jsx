import { FloatingContact, FeedbackSection, ContactLinks } from './components/StorefrontExtras.jsx'
import { availableVariants, catalogCodes } from './lib/storefront.js'
import { useEffect, useState } from 'react'

import './App.css'
import ProductModal from './ProductModal.jsx'

import kisetsuLogo from './assets/kisetsu-logo.png'
const magnateLogo = '/products/magnate.png'

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
import './storefront.css'
import './carousel-update.css'
import HomeCarousel from './components/HomeCarousel.jsx'


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
  useEffect(() => {
    const header = document.querySelector('.website .navbar')
    if (!header) return
    const updateScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24)
    const updateHeight = () => header.closest('.website').style.setProperty('--nav-height', `${header.offsetHeight}px`)
    const observer = new ResizeObserver(updateHeight)
    observer.observe(header)
    updateHeight()
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', updateScroll) }
  }, [])

  const { content: siteContent, canEdit, updateText, contentLoaded, adminMode } = useEditor()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showPaintingsPanel, setShowPaintingsPanel] = useState(false)
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [showStudentArtPanel, setShowStudentArtPanel] = useState(false)
  const [selectedStudentArt, setSelectedStudentArt] = useState(null)
  const [showWorkshopPanel, setShowWorkshopPanel] = useState(false)
  const [showPromotionPopup, setShowPromotionPopup] = useState(false)

  const [paintings, setPaintings] = useState([])
  const [editingPainting, setEditingPainting] = useState(null) // painting object, or {} for "new", or null for closed
  const [studentPaintings, setStudentPaintings] = useState([])
  const [editingStudentPainting, setEditingStudentPainting] = useState(null)
  const [tshirtProducts, setTshirtProducts] = useState([])
  const [editingTshirt, setEditingTshirt] = useState(null)

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
    reloadPaintings().catch(console.error)
    reloadStudentPaintings().catch(console.error)
    reloadTshirtProducts().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Show each enabled promotion popup once per promotion ID.
  // Admin users do not receive the public promotional popup.
  useEffect(() => {
    const promotion = siteContent.promotion

    if (
      adminMode || !contentLoaded ||
      !promotion?.enabled ||
      !promotion?.showPopup ||
      !promotion?.id
    ) {
      setShowPromotionPopup(false)
      return
    }

    let dismissedPromotionId
    try { dismissedPromotionId = window.localStorage.getItem('kisetsu-dismissed-promotion') } catch { /* Private browsing may disable storage. */ }

    if (dismissedPromotionId !== promotion.id) {
      const timer = window.setTimeout(() => setShowPromotionPopup(true), 12000)
      return () => window.clearTimeout(timer)
    }
  }, [
    adminMode, contentLoaded,
    siteContent.promotion?.enabled,
    siteContent.promotion?.showPopup,
    siteContent.promotion?.id,
  ])

  function closePromotionPopup() {
    const promotionId = siteContent.promotion?.id

    if (promotionId) {
      try { window.localStorage.setItem('kisetsu-dismissed-promotion', promotionId) } catch { /* Dismiss for this visit. */ }
    }

    setShowPromotionPopup(false)
  }

  function openPromotionDetails() {
    setShowPromotionPopup(false)
    setShowWorkshopPanel(true)
  }


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

  const [featureUploading, setFeatureUploading] = useState(null)
  async function handleFeatureUpload(index, file) {
    setFeatureUploading(index)
    try {
      const { url } = await uploadSiteImage(file, 'features')
      updateText(`features.${index}.image`, url)
    } finally { setFeatureUploading(null) }
  }
  const staticTshirts = [
    {
      number: 'K.E 01',
      adultPrice: 60, kidsPrice: 55,
      image: tshirt01,
      name: 'Kisetsu T-Shirt 01',
      description:
        'A creative expression designed for everyday wear.',
    },

    {
      number: 'K.E 02',
      adultPrice: 60, kidsPrice: 55,
      image: tshirt02,
      name: 'Kisetsu T-Shirt 02',
      description:
        'A unique design created to express your personality.',
    },

    {
      number: 'K.E 03',
      adultPrice: 60, kidsPrice: 55,
      image: tshirt03,
      name: 'Kisetsu T-Shirt 03',
      description:
        'Wear your story with a design made to stand out.',
    },

    {
      number: 'K.E 04',
      adultPrice: 60, kidsPrice: 55,
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

  const codes = catalogCodes(tshirtProducts, siteContent.productSettings)
  useEffect(() => {
    if (!canEdit || tshirtProducts.length === 0) return
    const settings = siteContent.productSettings || {}
    const assigned = catalogCodes(tshirtProducts, settings)
    const missing = tshirtProducts.filter(row => !settings[row.id]?.number)
    if (missing.length) {
      const next = { ...settings }
      missing.forEach(row => { next[row.id] = { ...next[row.id], number: assigned[row.id] } })
      updateText('productSettings', next)
    }
  }, [canEdit, tshirtProducts, siteContent.productSettings, updateText])
  const dynamicTshirts = tshirtProducts
    .filter(item => canEdit || item.status !== 'hidden')
    .map(item => {
      const config = siteContent.productSettings?.[item.id] || {}
      return {
        ...config, id: item.id, number: codes[item.id],
        image: availableVariants(config)[0]?.images?.[0] || item.image_url || tshirt01,
        name: item.title, description: item.description, priceText: item.price_text,
        category: item.category, status: item.status, isDynamic: true, raw: item,
      }
    })
  const purpose = siteContent.purposeProduct
  const purposeImages = availableVariants(purpose)[0]?.images || []
  const tshirts = [
    ...(canEdit || (purpose.enabled !== false && purpose.status !== 'hidden') ? [{ ...purpose, image: purposeImages[0], featured: true }] : []),
    ...staticTshirts, ...dynamicTshirts,
  ]

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


        <div className="nav-tagline"><EditableText path="hero.title" as="h1" preLine /></div>
        <nav className="nav-links" aria-label="Main navigation">

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


      </header>


      <main>

        {/* =========================
            HERO
        ========================== */}

        <HomeCarousel />
        <section
          id="tshirts"
          className="tshirts-section"
        >

          <div className="services-header">

            <EditableText path="tshirtsSection.eyebrow" as="p" className="eyebrow" />

            <EditableText path="tshirtsSection.heading" as="h2" preLine />
            <a className="button button-primary talk-attention" href={whatsappLink} target="_blank" rel="noopener noreferrer">Talk to Us</a>

          </div>


          <div className="tshirt-grid">

            {tshirts.map((shirt) => (

              <article
                className={`tshirt-card tshirt-card-interactive${shirt.featured ? ' purpose-featured' : ''}`}
                key={shirt.id || shirt.number}
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
                      loading="lazy"
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
                      {shirt.featured ? "FEATURED · " : ""}{shirt.number}
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
                    Choose options →
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

        <section id="discover" className="offering-links" aria-label="Explore Kisetsu">
          {siteContent.features.map(feature => <a key={feature.key} href={feature.href}>{feature.title} <span aria-hidden="true">↗</span></a>)}
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

      <FeedbackSection whatsappLink={whatsappLink} />
      <FloatingContact whatsappLink={whatsappLink} suppressed={!!(selectedProduct || showPaintingsPanel || selectedPainting || showStudentArtPanel || selectedStudentArt || showWorkshopPanel || showPromotionPopup)} />
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

              <h4>CONNECT</h4>
              <ContactLinks whatsappLink={whatsappLink} facebookLink={facebookLink} />

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


            <div className="magnate-logo-frame"><img
              src={magnateLogo}
              alt="Magnate eBiz"
              className="magnate-logo"
            /></div>

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
