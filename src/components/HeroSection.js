import React, { useEffect, useState } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';

  return (
    <div className="ceo-hero-section">
      {/* Subtle Background Pattern */}
      <div className="hero-pattern"></div>
      <div className="hero-gradient"></div>

      <div className={`hero-container ${isVisible ? 'visible' : ''}`}>
        {/* Left Content - Minimal Information */}
        <div className="hero-left">
          <div className="hero-label">
            <span className="label-line"></span>
            <span className="label-text">Chief Executive Officer</span>
          </div>

          <h1 className="hero-title">
            <span className="title-line">Mr.</span>
            <span className="title-line title-main">Nikhil Kamath</span>
          </h1>

          <p className="hero-subtitle">
           Building sustainable businesses at the intersection of finance and technology.
          </p>

          {/* Expertise Pills */}
          <div className="expertise-pills">
            <div className="pill">FinTech</div>
            <div className="pill">Investment</div>
            <div className="pill">Venture Capital</div>
            <div className="pill">Philanthropy</div>
          </div>

          {/* Key Metrics */}
          <div className="hero-metrics">
            <div className="metric">
              <div className="metric-value">15+</div>
              <div className="metric-label">Years of Excellence</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <div className="metric-value">50+</div>
              <div className="metric-label">Investments in startups/companies</div>
            </div>
            <div className="metric-divider"></div>
            <div className="metric">
              <div className="metric-value">3+</div>
              <div className="metric-label">Companies Founded</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hero-actions">
            <a href="#contact" className="cta-primary">
              <span>Schedule a Consultation</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/blog" className="cta-secondary">
              <span>Insights & Leadership</span>
            </a>
          </div>

          {/* Minimal Social Links */}
          <div className="hero-social">
            <a href="https://www.linkedin.com/in/nikhilkamathcio/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
            <a href="mailto:nikhil.k@zerodha.com" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="5" width="18" height="14" rx="2"/>
                <path d="M3 7l9 6 9-6"/>
              </svg>
            </a>
            <a href="https://x.com/nithin0dha?s=21" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.54-2.12-9.91-5.04-.42.72-.66 1.55-.66 2.44 0 1.67.85 3.14 2.14 4-.79-.03-1.53-.24-2.18-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.94 2.42 3.35 4.55 3.39-1.67 1.31-3.77 2.09-6.05 2.09-.39 0-.78-.02-1.17-.07 2.18 1.4 4.77 2.21 7.56 2.21 9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.8-1.56 2.46-2.55z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Image - CEO Portrait */}
        <div className="hero-right">
          <div
            className="image-frame"
            style={{
              transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`
            }}
          >
            {/* CEO Image */}
            <div className="image-container">
              <img
                src={`${API_URL}/uploads/nikhil-ceo1.png`}
                alt="Nikhil kamath CEO"
                className="ceo-image"
              />
              <div className="image-overlay"></div>
            </div>

            {/* Design Component - Center Right to Center Bottom */}
            <svg className="flow-design" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 180 140 Q 150 160, 120 180 Q 90 200, 80 240"
                stroke="url(#flowGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="180" cy="140" r="5" fill="#c5a065" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="240" r="5" fill="#c5a065" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
              </circle>
              <defs>
                <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c5a065" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#c5a065" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>

            {/* Subtle Badge */}
            <div className="achievement-badge">
              <div className="badge-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div className="badge-content">
                <div className="badge-title">Entrepreneur and Investor</div>
                <div className="badge-text">Zerodha • True Beacon • Rainmatter • WTFund</div>
              </div>
            </div>
          </div>

          {/* Minimal Accent Elements */}
          <div className="accent-dot accent-dot-1"></div>
          <div className="accent-dot accent-dot-2"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-hint">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span className="scroll-text">Explore More</span>
      </div>
    </div>
  );
};

export default HeroSection;
