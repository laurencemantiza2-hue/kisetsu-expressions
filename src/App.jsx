import './App.css'

import kisetsuLogo from './assets/kisetsu-logo.png'
import magnateLogo from './assets/magnate-logo.png'

function App() {
  return (
    <div className="website">

      {/* =========================
          NAVIGATION
      ========================== */}

      <header className="navbar">

        <a href="#home" className="nav-logo">
          <img
            src={kisetsuLogo}
            alt="Kisetsu Expressions"
          />
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <a
          href="https://wa.me/971545735918"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-contact"
        >
          WhatsApp
        </a>

      </header>


      {/* =========================
          HERO SECTION
      ========================== */}

      <main>

        <section id="home" className="hero-section">

          <div className="hero-overlay"></div>

          <div className="hero-content">

            <p className="eyebrow">
              CREATIVE • EXPRESSIVE • PURPOSEFUL
            </p>

            <h1>
              Your Story.
              <br />
              Beautifully Gifted.
            </h1>

            <p className="hero-description">
              Thoughtfully crafted gifts and creative expressions
              designed to turn meaningful moments into lasting memories.
            </p>

            <div className="hero-buttons">

              <a
                href="#services"
                className="button button-primary"
              >
                Explore Our Services
              </a>

              <a
                href="https://wa.me/971545735918"
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
              Every gift tells a story.
            </h2>

            <p>
              At Kisetsu Expressions, we believe that the best gifts
              are more than objects. They carry emotions, memories,
              appreciation, and stories that deserve to be remembered.
            </p>

          </div>

        </section>


        {/* =========================
            ABOUT
        ========================== */}

        <section id="about" className="about-section">

          <div className="section-label">
            ABOUT US
          </div>

          <div className="about-grid">

            <div className="about-heading">

              <h2>
                Made with
                <br />
                meaning.
              </h2>

            </div>

            <div className="about-text">

              <p>
                Kisetsu Expressions is a creative gifting store
                dedicated to creating thoughtful and memorable
                expressions for every occasion.
              </p>

              <p>
                From personal celebrations to meaningful surprises,
                we help transform your ideas into something tangible,
                beautiful, and worth remembering.
              </p>

              <p>
                Whether you're celebrating someone special,
                expressing gratitude, or simply making someone smile,
                Kisetsu Expressions is here to help tell your story.
              </p>

            </div>

          </div>

        </section>


        {/* =========================
            SERVICES
        ========================== */}

        <section id="services" className="services-section">

          <div className="services-header">

            <p className="eyebrow">
              WHAT WE DO
            </p>

            <h2>
              Expressions made
              <br />
              for every occasion.
            </h2>

          </div>


          <div className="service-grid">

            <article className="service-card">

              <span className="service-number">
                01
              </span>

              <h3>
                Personalized Gifts
              </h3>

              <p>
                Thoughtful personalized gifts created to make
                someone's special moment even more memorable.
              </p>

              <a href="#contact">
                Learn more →
              </a>

            </article>


            <article className="service-card">

              <span className="service-number">
                02
              </span>

              <h3>
                Creative Expressions
              </h3>

              <p>
                Unique creative pieces designed around your ideas,
                stories, personality, and special occasions.
              </p>

              <a href="#contact">
                Learn more →
              </a>

            </article>


            <article className="service-card">

              <span className="service-number">
                03
              </span>

              <h3>
                Custom Projects
              </h3>

              <p>
                Have something specific in mind? Let's turn your
                concept into a meaningful creative project.
              </p>

              <a href="#contact">
                Start a project →
              </a>

            </article>

          </div>

        </section>


        {/* =========================
            CALL TO ACTION
        ========================== */}

        <section className="cta-section">

          <div className="cta-content">

            <p className="eyebrow">
              HAVE AN IDEA?
            </p>

            <h2>
              Let's create
              <br />
              something meaningful.
            </h2>

            <p>
              Tell us what you have in mind and let's create
              something special together.
            </p>

            <a
              href="https://wa.me/971545735918"
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

        <section id="contact" className="contact-section">

          <div className="section-label">
            GET IN TOUCH
          </div>

          <div className="contact-grid">

            <div>

              <h2>
                We'd love to
                <br />
                hear from you.
              </h2>

            </div>

            <div className="contact-details">

              <div className="contact-item">

                <span>
                  WHATSAPP
                </span>

                <a
                  href="https://wa.me/971545735918"
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
                  href="https://www.facebook.com/kisetsuexpressions/"
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

              <a href="#services">
                Services
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
                href="https://wa.me/971545735918"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>

              <a
                href="https://www.facebook.com/kisetsuexpressions/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>

            </div>

          </div>

        </div>


        {/* Powered by Magnate */}

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


        <div className="footer-bottom">

          <p>
            © 2026 Kisetsu Expressions. All rights reserved.
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