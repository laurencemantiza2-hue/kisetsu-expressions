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
import { hasSupabaseConfig, supabase } from './supabase.js'
import { defaultSiteContent, mergeSiteContent } from './siteContent.js'


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
}) {
  const isSelected = Boolean(selectedArtwork)
  const title = type === 'painting' ? 'Paintings' : 'Student Art'
  const eyebrow = type === 'painting' ? 'ORIGINAL PAINTINGS' : 'STUDENT ART'

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
                <button
                  type="button"
                  key={artwork.id}
                  onClick={() => onSelectArtwork(artwork)}
                  style={{
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
                      {type === 'painting' ? 'Original Artwork' : 'Student Artwork'}
                    </p>
                    <h3 style={{ margin: '7px 0 5px', fontSize: 20 }}>
                      {artwork.name}
                    </h3>
                    <p style={{ margin: 0, opacity: .72 }}>
                      {artwork.description}
                    </p>
                  </div>
                </button>
              ))}
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


function App() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showPaintingsPanel, setShowPaintingsPanel] = useState(false)
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [showStudentArtPanel, setShowStudentArtPanel] = useState(false)
  const [selectedStudentArt, setSelectedStudentArt] = useState(null)
  const [activeFeature, setActiveFeature] = useState(0)
  const [isFeaturePaused, setIsFeaturePaused] = useState(false)
  const [siteContent, setSiteContent] = useState(defaultSiteContent)

  const whatsappLink = 'https://wa.me/971545735918'

  const facebookLink =
    'https://www.facebook.com/kisetsuexpressions/'

  const createWhatsappLink = (message) =>
    whatsappLink + '?text=' + encodeURIComponent(message)

  useEffect(() => {
    if (!hasSupabaseConfig) return undefined

    async function loadSiteSettings() {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'default')
        .maybeSingle()

      if (!error && data?.content) setSiteContent(mergeSiteContent(data.content))
    }

    loadSiteSettings()
    return undefined
  }, [])

  const heroImage = siteContent.hero.image

  // Temporary single-artwork collections.
  // Later, these can be replaced by artwork records loaded from Supabase
  // by the Admin dashboard without changing the customer-facing flow.
  const paintings = [
    {
      id: 'painting-01',
      image: siteContent.features[1].image,
      name: 'Kisetsu Original Painting',
      description: 'Original artwork created to bring colour, warmth, and character into your space.',
      size: '',
      price: '',
    },
  ]

  const studentArt = [
    {
      id: 'student-art-01',
      image: siteContent.features[2].image,
      name: 'Student Artwork',
      description: 'A student-created artwork celebrating creativity, confidence, and individuality.',
      size: '',
      price: '',
    },
  ]

  const features = [
    {
      title: 'T-Shirts',
      description: 'Wear art that feels personal, expressive, and made to be seen.',
      image: siteContent.features[0].image,
      imageAlt: 'Person wearing a colourful Kisetsu T-shirt design',
      action: 'Shop T-Shirts',
      href: '#tshirts',
    },
    {
      title: 'Paintings',
      description: 'Original work with colour, feeling, and a story for your space.',
      image: siteContent.features[1].image,
      imageAlt: 'Original Kisetsu painting displayed in a home',
      action: 'Explore Paintings',
      href: '#paintings',
    },
    {
      title: 'Student Art',
      description: 'A celebration of young artists, new perspectives, and proud creative moments.',
      image: siteContent.features[2].image,
      imageAlt: 'Student holding a completed painting',
      action: 'Explore Student Art',
      href: '#student-art',
    },
    {
      title: 'Workshops',
      description: 'Bring people together through a guided, hands-on creative experience.',
      image: siteContent.features[3].image,
      imageAlt: 'Students creating art together in a workshop',
      action: 'Plan Your Creative Workshop',
      href: '#workshops',
    },
  ]

  useEffect(() => {
    if (isFeaturePaused) return undefined

    const timer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [features.length, isFeaturePaused])


  const tshirts = [
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

          <div className="hero-content">

            <p className="eyebrow">
              {siteContent.hero.eyebrow}
            </p>


            <h1>
              {siteContent.hero.title.split('\n').map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index < siteContent.hero.title.split('\n').length - 1 ? <br /> : null}
                </span>
              ))}
            </h1>


            <p className="hero-description">
              {siteContent.hero.description}
            </p>


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
              <p className="eyebrow">CHOOSE YOUR EXPRESSION</p>
              <h2>Made for every<br />creative moment.</h2>
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
                <article className="feature-slide" key={feature.title}>
                  <img src={feature.image} alt={feature.imageAlt} />
                  <div className="feature-slide-content">
                    <p className="eyebrow">KISETSU {feature.title.toUpperCase()}</p>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
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
                    key={feature.title}
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

            <p className="eyebrow">
              KISETSU EXPRESSIONS
            </p>


            <h2>
              More than a shirt.
              <br />
              It's an expression.
            </h2>


            <p>
              At Kisetsu Expressions, we believe what you
              wear can say something about who you are.
              Our T-shirts are created to bring personality,
              creativity, and meaning into everyday style.
            </p>

          </div>

        </section>


        {/* =========================
            PAINTINGS
        ========================== */}

        <section id="paintings" className="expression-section paintings-section">
          <div className="expression-image">
            <img src={siteContent.features[1].image} alt="Original Kisetsu painting displayed in a home" />
          </div>

          <div className="expression-content">
            <p className="eyebrow">ORIGINAL PAINTINGS</p>
            <h2>Art that gives<br />a room a story.</h2>
            <p>
              Discover original paintings created to bring warmth, colour,
              and a personal sense of expression into your space.
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={() => {
                setSelectedPainting(null)
                setShowPaintingsPanel(true)
              }}
            >
              Explore Paintings →
            </button>
          </div>
        </section>


        {/* =========================
            STUDENT ART
        ========================== */}

        <section id="student-art" className="expression-section student-art-section">
          <div className="expression-content">
            <p className="eyebrow">STUDENT ART</p>
            <h2>Big imagination.<br />Proudly shared.</h2>
            <p>
              Student art is where confidence grows and new voices emerge.
              Explore the creativity, care, and individuality behind each piece.
            </p>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setSelectedStudentArt(null)
                setShowStudentArtPanel(true)
              }}
            >
              Explore Student Art →
            </button>
          </div>

          <div className="expression-image">
            <img src={siteContent.features[2].image} alt="Student holding a completed painting" />
          </div>
        </section>


        {/* =========================
            WORKSHOPS
        ========================== */}

        <section id="workshops" className="workshops-section">
          <div className="workshops-image">
            <img src={siteContent.features[3].image} alt="Students creating art together in a workshop" />
          </div>

          <div className="workshops-content">
            <p className="eyebrow">CREATIVE WORKSHOPS</p>
            <h2>Make something<br />meaningful together.</h2>
            <p>
              Plan a relaxed, guided art experience for your group. Tell us your
              preferred date, group size, and creative idea, and we will help shape the session.
            </p>
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

              <h2>
                Made to
                <br />
                express.
              </h2>

            </div>


            <div className="about-text">

              <p>
                Kisetsu Expressions is a creative T-shirt
                brand focused on meaningful designs and
                expressive everyday wear.
              </p>


              <p>
                Each design is created with the idea that
                clothing can be more than something you wear.
                It can represent an idea, a feeling, a memory,
                or simply your personality.
              </p>


              <p>
                This is just the beginning. As Kisetsu grows,
                more products and creative expressions will
                be introduced.
              </p>

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

            <p className="eyebrow">
              THE COLLECTION
            </p>


            <h2>
              T-Shirts made
              <br />
              to be seen.
            </h2>

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

          </div>

        </section>


        {/* =========================
            CALL TO ACTION
        ========================== */}

        <section className="cta-section">

          <div className="cta-content">

            <p className="eyebrow">
              READY TO EXPRESS YOURSELF?
            </p>


            <h2>
              Find your
              <br />
              expression.
            </h2>


            <p>
              See something you like? Contact Kisetsu
              Expressions directly and let's get your
              T-shirt ready.
            </p>


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

              <h2>
                Let's talk
                <br />
                T-shirts.
              </h2>

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
          artworks={paintings}
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

    </div>
  )
}


export default App
