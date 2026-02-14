import React, { useEffect, useState } from 'react';
import './LeadershipPhilosophySection.css';

const LeadershipPhilosophySection = () => {
  const [philosophy, setPhilosophy] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchPhilosophyData();
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

    const element = document.getElementById('academics');
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const fetchPhilosophyData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4006';
      const response = await fetch(`${API_URL}/api/content/public/all`);
      const data = await response.json();

      if (data.success && data.data.leadershipPhilosophy) {
        setPhilosophy(data.data.leadershipPhilosophy);
      }
    } catch (error) {
      console.error('Error fetching leadership philosophy data:', error);
    }
  };

  return (
    <section id="academics" className={`philosophy-section ${isVisible ? 'visible' : ''}`}>
      <div className="philosophy-pattern"></div>
      <div className="philosophy-gradient"></div>

      <div className="philosophy-container">
        {/* Section Header */}
        <div className="philosophy-header">
          <div className="section-label">
            <span className="label-line"></span>
            <span className="label-text">Principles & Values</span>
          </div>
          <h2 className="section-title">Leadership Philosophy</h2>
          <p className="section-subtitle">
            Core principles that drive strategic decisions and organizational excellence
          </p>
        </div>

        {/* Philosophy Grid */}
        {philosophy && philosophy.length > 0 ? (
          <>
            <div className="philosophy-grid">
              {philosophy.map((item, index) => (
                <div
                  key={item._id}
                  className="philosophy-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  {item.icon && (
                    <div className="philosophy-icon">
                      {item.icon}
                    </div>
                  )}

                  {/* Content */}
                  <div className="philosophy-content">
                    <h3 className="philosophy-title">{item.title}</h3>
                    <p className="philosophy-description">{item.description}</p>
                  </div>

                  {/* Number Badge */}
                  <div className="philosophy-number">{String(index + 1).padStart(2, '0')}</div>

                  <div className="philosophy-shine"></div>
                </div>
              ))}
            </div>

            {/* Quote Section */}
            <div className="philosophy-quote">
              <svg className="quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21C3 21 9 15 9 9C9 6 6 3 6 3M15 21C15 21 21 15 21 9C21 6 18 3 18 3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <blockquote className="quote-text">
                "Change is the only constant in life. Adapt first, don’t fight"
              </blockquote>
              <div className="quote-author">Nikhil Kamath</div>
            </div>
          </>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</div>
        )}
      </div>
    </section>
  );
};

export default LeadershipPhilosophySection;
