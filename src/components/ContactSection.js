import React, { useEffect, useState } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('contact');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const contactInfo = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'True Beacon',
      value: 'info@truebeacon.com',
      link: 'mailto:info@truebeacon.com'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Gruhas (VC/Pitch Decks)',
      value: 'hello@gruhas.com',
      link: 'mailto:hello@gruhas.com'
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      ),
      label: 'Headquarters',
      value: 'Bengaluru, Karnataka, India',
      link: null
    }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
        </svg>
      ),
      url: 'https://linkedin.com/in/nikhilkamathcio',
      label: 'Connect on LinkedIn'
    },
    {
      name: 'Twitter',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.56 2.21 9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
        </svg>
      ),
      url: 'https://twitter.com/nikhilkamathcio',
      label: 'Follow on Twitter'
    },
    {
      name: 'YouTube',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      url: 'https://youtube.com/@NikhilKamath',
      label: 'Watch on YouTube'
    },
    {
      name: 'Instagram',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      ),
      url: 'https://instagram.com/nikhilkamathcio',
      label: 'Follow on Instagram'
    }
  ];

  return (
    <section id="contact" className={`contact-section ${isVisible ? 'visible' : ''}`}>
      <div className="contact-pattern"></div>
      <div className="contact-gradient"></div>

      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <div className="section-label">
            <span className="label-line"></span>
            <span className="label-text">Get In Touch</span>
          </div>
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle">
            Interested in partnerships, investment opportunities, or just want to connect? Reach out through official channels.
          </p>
        </div>

        {/* Contact Content Grid */}
        <div className="contact-content">
          {/* Left: CTA */}
          <div className="contact-cta">
            <h3 className="cta-title">Get In Touch</h3>
            <p className="cta-description">
              For investment inquiries, startup pitches, or partnership opportunities — reach out through the relevant channels below.
            </p>

            {/* Primary Email Buttons */}
            <div className="cta-buttons">
              <a
                href="mailto:info@truebeacon.com"
                className="cta-button primary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>True Beacon Inquiries</span>
              </a>
              <a
                href="mailto:hello@gruhas.com"
                className="cta-button secondary"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Pitch to Gruhas</span>
              </a>
            </div>

            {/* Response Time */}
            <div className="response-time">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Typical response within 24 hours</span>
            </div>
          </div>

          {/* Right: Contact Info */}
          <div className="contact-info-grid">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="contact-info-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="info-icon">{info.icon}</div>
                <div className="info-content">
                  <div className="info-label">{info.label}</div>
                  {info.link ? (
                    <a href={info.link} className="info-value link">
                      {info.value}
                    </a>
                  ) : (
                    <div className="info-value">{info.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Links */}
        <div className="contact-social">
          <h4 className="social-title">Follow Nikhil Kamath</h4>
          <div className="social-links">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={social.label}
                title={social.label}
              >
                {social.icon}
                <span className="social-name">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Developer Credit */}
        <div className="developer-credit">
          <div className="developer-credit-inner">
            <div className="developer-info">
              <div className="developer-label">Designed & Developed by</div>
              <h4 className="developer-name">Rudresh Tiwari</h4>
              <p className="developer-role">Full Stack Developer</p>
            </div>
            <div className="developer-links">
              <a
                href="https://rudreshtiwari10.github.io/Portfolio/"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-link portfolio-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M2 12H22" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 2C14.5 4.5 15.5 8 15.5 12C15.5 16 14.5 19.5 12 22C9.5 19.5 8.5 16 8.5 12C8.5 8 9.5 4.5 12 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <span>Portfolio</span>
              </a>
              <a
                href="https://www.linkedin.com/in/rudresh-tiwari-99bb57297/"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/rudreshtiwari10/executive-portfolio-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="developer-link"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="contact-footer">
          <p className="footer-note">
            Removing barriers, one venture at a time.
          </p>
          <div className="footer-divider"></div>
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Rudresh Tiwari. All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
