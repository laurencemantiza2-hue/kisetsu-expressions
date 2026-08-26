import { useState } from 'react'

import './App.css'

import kisetsuLogo from './assets/kisetsu-logo.png'
import magnateLogo from './assets/magnate-logo.png'

import tshirt01 from './assets/kisetsu-tshirt1.jpg'
import tshirt02 from './assets/kisetsu-tshirt2.jpg'
import tshirt03 from './assets/kisetsu-tshirt3.jpg'
import tshirt04Red from './assets/tshirt-black-red-print.jpg'
import tshirt04White from './assets/tshirt-black-white-print.jpg'

function TshirtSwapImage({ primary, altImage, name }) {
  const [showAlt, setShowAlt] = useState(false)

  function handleClick() {
    const canHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    if (!canHover) {
      setShowAlt((open) => !open)
    }
  }

  return (
    <div
      className={'tshirt-swap' + (showAlt ? ' is-alt' : '')}
      onClick={handleClick}
    >
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

function App() {

  const whatsappLink = 'https://wa.me/971545735918'

  const facebookLink =
    'https://www.facebook.com/kisetsuexpressions/'


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
    },
  ]


  return (
    <div className="website">

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


      {/* =========================
          HERO
      ========================== */}

      <main>

        <section
          id="home"
          className="hero-section"
        >

          <div className="hero-content">

            <p className="eyebrow">
              KISETSU EXPRESSIONS
            </p>


            <h1>
              Wear Your
              <br />
              Story.
            </h1>


            <p className="hero-description">
              T-shirts designed to express your personality,
              your moments, and the stories that make you
              who you are.
            </p>


            <div className="hero-buttons">

              <a
                href="#tshirts"
                className="button button-primary"
              >
                Explore T-Shirts
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
                className="tshirt-card"
                key={shirt.number}
              >

                <div className="tshirt-image">

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


                  <a
                    href={
                      whatsappLink +
                      '?text=Hi%20Kisetsu%20Expressions!%20I%27m%20interested%20in%20' +
                      encodeURIComponent(shirt.name) +
                      '.'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order via WhatsApp →
                  </a>

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
              Wear your story.
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

    </div>
  )
}


export default App