import React, { useEffect, useState, useCallback } from 'react';
import './AboutSection.css';

const CAROUSEL_IMAGES = [
  { src: '/images/IMG1.JPG', alt: 'CEO' },
  { src: '/images/IMG2.JPG', alt: 'CEO' },
  { src: '/images/IMG3.JPG', alt: 'CEO' },
  { src: '/images/IMG_4.jpg', alt: 'CEO' },
];

const SLIDE_DURATION = 4000;

const AboutSection = () => {
  const [about, setAbout] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchAboutData();
  }, []);

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

    const element = document.getElementById('about');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const fetchAboutData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
      console.log('[AboutSection] Fetching from:', `${API_URL}/api/content/public/all`);
      const response = await fetch(`${API_URL}/api/content/public/all`);
      const data = await response.json();
      console.log('[AboutSection] API Response:', data);
      console.log('[AboutSection] About data:', data.data?.about);

      if (data.success && data.data.about) {
        console.log('[AboutSection] Setting about data');
        setAbout(data.data.about);
      } else {
        console.log('[AboutSection] No about data found or success=false');
      }
    } catch (error) {
      console.error('[AboutSection] Error fetching about data:', error);
    }
  };

  return (
    <section id="about" className={`about-section ${isVisible ? 'visible' : ''}`}>
      <div className="about-pattern"></div>
      <div className="about-gradient"></div>

      <div className="about-container">
        {/* Section Header */}
        <div className="about-header">
          <div className="section-label">
            <span className="label-line"></span>
            <span className="label-text">About</span>
          </div>
          <h2 className="section-title">Entrepreneurship 
          </h2>
        </div>

        {/* Main Content Grid */}
        {about ? (
          <div className="about-content">
            {/* Left: Biography */}
            <div className="about-bio">
              <div className="bio-content">
                {about.biography && about.biography.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="bio-paragraph">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Carousel + Highlights */}
            <div className="about-side">
              {/* Image Carousel */}
              <div
                className="about-carousel-wrapper"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                {/* Animated snake border SVG */}
                <svg
                  className="carousel-snake-svg"
                  viewBox="0 0 600 400"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    className="carousel-snake-glow"
                    x="1.5" y="1.5" width="597" height="397"
                    rx="14" ry="14"
                    pathLength="100"
                  />
                  <rect
                    className="carousel-snake-path"
                    x="1.5" y="1.5" width="597" height="397"
                    rx="14" ry="14"
                    pathLength="100"
                  />
                </svg>

                <div className="about-carousel-frame">
                  <div className="carousel-inner">
                    {CAROUSEL_IMAGES.map((image, index) => (
                      <img
                        key={index}
                        src={image.src}
                        alt={image.alt}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                  <div className="carousel-indicators">
                    {CAROUSEL_IMAGES.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlights - below carousel */}
              {about.highlights && about.highlights.length > 0 && (
                <div className="about-highlights">
                  {about.highlights.map((highlight, index) => (
                    <div key={index} className="highlight-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12L10 17L20 7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0a0a0' }}>
            <p>Loading content...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
