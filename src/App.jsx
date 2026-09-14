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
          className="nav-contact"
        >
          WhatsApp
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
            <a
              href={createWhatsappLink('Hello Kisetsu Expressions, I would like to plan a creative workshop. Preferred date: __ / Group size: __ / Idea: __')}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-light"
            >
              Plan Your Creative Workshop
            </a>
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
