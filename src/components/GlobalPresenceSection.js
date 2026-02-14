import React, { useEffect, useState } from 'react';
import './GlobalPresenceSection.css';

const GlobalPresenceSection = () => {
  const [globalPresence, setGlobalPresence] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchGlobalPresenceData();
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

    const element = document.getElementById('experience');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const fetchGlobalPresenceData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
      const response = await fetch(`${API_URL}/api/content/public/all`);
      const data = await response.json();

      if (data.success && data.data.globalPresence) {
        setGlobalPresence(data.data.globalPresence);
      }
    } catch (error) {
      console.error('Error fetching global presence data:', error);
    }
  };

  return (
    <section id="experience" className={`global-presence-section ${isVisible ? 'visible' : ''}`}>
      <div className="global-presence-pattern"></div>
      <div className="global-presence-gradient"></div>

      <div className="global-presence-container">
        {/* Section Header */}
        <div className="global-presence-header">
          <div className="section-label">
            <span className="label-line"></span>
            <span className="label-text">Media</span>
          </div>
          <h2 className="section-title">Media Presence</h2>
          <p className="section-subtitle">
            Hosting conversations with the world's most influential leaders across business, technology, and culture
          </p>
        </div>

        {/* Countries Grid */}
        {globalPresence && globalPresence.length > 0 ? (
          <>
            <div className="countries-grid">
              {globalPresence.map((country, index) => (
                <div
                  key={country._id}
                  className="country-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Flag Emoji */}
                  {country.flagEmoji && (
                    <div className="country-flag">{country.flagEmoji}</div>
                  )}

                  {/* Country Info */}
                  <div className="country-info">
                    <h3 className="country-name">{country.country}</h3>

                    {country.region && (
                      <div className="country-region">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <span>{country.region}</span>
                      </div>
                    )}

                    {country.description && (
                      <p className="country-description">{country.description}</p>
                    )}

                    {/* Partnerships */}
                    {country.partnerships && country.partnerships.length > 0 && (
                      <div className="country-partnerships">
                        <h4 className="partnerships-title">Notable Highlights</h4>
                        <ul className="partnerships-list">
                          {country.partnerships.map((partnership, idx) => (
                            <li key={idx} className="partnership-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path
                                  d="M5 12L10 17L20 7"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>{partnership}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="country-shine"></div>
                </div>
              ))}
            </div>

            {/* Media Stats */}
            <div className="global-stats">
              <div className="stat-item">
                <div className="stat-value">{globalPresence.length}+</div>
                <div className="stat-label">Shows & Platforms</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">
                  {globalPresence.reduce((acc, item) =>
                    acc + (item.partnerships ? item.partnerships.length : 0), 0
                  )}+
                </div>
                <div className="stat-label">Notable Appearances</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-value">
                  {new Set(globalPresence.map(c => c.region)).size}
                </div>
                <div className="stat-label">Platforms</div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</div>
        )}
      </div>
    </section>
  );
};

export default GlobalPresenceSection;
