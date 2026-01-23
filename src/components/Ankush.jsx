

import React, { useState, useEffect } from "react";
// import "./App.css";

// --- Components ---

const SocialIcon = ({ color, path }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="social-svg"
  >
    {path}
  </svg>
);

const Section = ({ id, title, children, className }) => (
  <section id={id} className={`content-section ${className || ""}`}>
    <div className="container">
      <h2 className="section-title">{title}</h2>
      <div className="section-body">{children}</div>
    </div>
  </section>
);

// --- Main App ---

function Ankush() {
  const [showSocials, setShowSocials] = useState(false);
  const [scrolledPastHome, setScrolledPastHome] = useState(false);

  // Handle Scroll Logic
  useEffect(() => {
    const handleScroll = () => {
      const homeHeight = window.innerHeight - 100; // Buffer
      if (window.scrollY > homeHeight) {
        setScrolledPastHome(true);
      } else {
        setScrolledPastHome(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth Scroll Helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="App">
      {/* --- Navbar (Appears after Home) --- */}
      <nav className={`navbar ${scrolledPastHome ? "visible" : ""}`}>
        <div className="nav-logo">Abhisekh.</div>
        <div className="nav-links">
          <button onClick={() => scrollToSection("vision")}>Vision</button>
          <button onClick={() => scrollToSection("insight")}>Insights</button>
          <button onClick={() => scrollToSection("achievement")}>
            Achievements
          </button>
          <button onClick={() => scrollToSection("contact")}>Contact</button>
        </div>
      </nav>

      {/* --- Home Page --- */}
      <header id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-text-side">
            <h3 className="pre-title">Cheif Executive Officer</h3>
            <h1 className="hero-name">Abhisekh Singh </h1>
            <p className="hero-bio">
              Leading global innovation through strategic vision and relentless
              execution. Transforming industries one decision at a time.
            </p>

            {/* Data Points */}
            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-number">8+</span>
                <span className="stat-label">Countries Visited</span>
              </div>
              <div className="stat-box">
                <span className="stat-number">3</span>
                <span className="stat-label">Global HQs</span>
              </div>
            </div>

            {/* Connect Button Logic */}
            <div className="connect-wrapper">
              <button
                className="btn-primary"
                onClick={() => setShowSocials(!showSocials)}
              >
                {showSocials ? "Close" : "Connect Me"}
              </button>

              <div className={`social-icons ${showSocials ? "show" : ""}`}>
                {/* Replace href="#" with your real links later */}
                <a href="#" className="icon-link linkedin">
                  <SocialIcon
                    color="#0077b5"
                    path={<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />}
                  />
                </a>
                <a href="#" className="icon-link whatsapp">
                  <SocialIcon
                    color="#25D366"
                    path={<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />}
                  />
                </a>
                <a href="#" className="icon-link facebook">
                  <SocialIcon
                    color="#1877F2"
                    path={<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />}
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="hero-image-side">
            {/* Placeholder Image - Replace src with actual CEO photo */}
            <div className="image-frame">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="CEO"
              />
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div
          className="scroll-down-btn"
          onClick={() => scrollToSection("vision")}
        >
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span>Scroll</span>
        </div>
      </header>

      {/* --- Other Sections --- */}

      <Section id="vision" title="Our Vision" className="bg-light">
        <p className="section-text">
          To bridge the gap between human potential and technological advancement.
          We envision a future where sustainability and profitability coexist,
          driving humanity forward into a new era of prosperity.
        </p>
        <div className="card-grid">
            <div className="card"><h3>Innovation</h3><p>Leading with tech.</p></div>
            <div className="card"><h3>Growth</h3><p>Sustainable scaling.</p></div>
            <div className="card"><h3>People</h3><p>Culture first.</p></div>
        </div>
      </Section>

      <Section id="insight" title="Insights" className="bg-dark">
        <p className="section-text">
          Market trends suggest a pivotal shift towards AI-driven decision making.
          Check out my latest articles and thoughts on the global economy.
        </p>
        <div className="insight-list">
            <div className="insight-item"><span>2024</span> The Future of Fintech</div>
            <div className="insight-item"><span>2023</span> Leadership in Crisis</div>
            <div className="insight-item"><span>2022</span> Scaling Across Borders</div>
        </div>
      </Section>

      <Section id="achievement" title="Achievements" className="bg-light">
        <div className="stats-grid">
            <div className="stat-card"><h2>$50M+</h2><p>Revenue Generated</p></div>
            <div className="stat-card"><h2>3</h2><p>Unicorn Exits</p></div>
            <div className="stat-card"><h2>500+</h2><p>Employees Led</p></div>
        </div>
      </Section>

      <Section id="contact" title="Contact Us" className="bg-dark last-page">
        <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Message" rows="5"></textarea>
            <button className="btn-primary">Send Message</button>
        </form>
      </Section>

      {/* --- AI Floating Button (Visible only after Home) --- */}
      {scrolledPastHome && (
        <div className="ai-float-btn">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a2 2 0 0 1 2 2c0 7.41 6 11 6 11.5S15 22 12 22 4 22 4 15.5 10 11.41 10 4a2 2 0 0 1 2-2z" />
            <path d="M8.5 10a16.5 16.5 0 0 0 6 0" />
          </svg>
          <span className="ai-tooltip">Ask AI</span>
        </div>
      )}
    </div>
  );
}

export default Ankush;