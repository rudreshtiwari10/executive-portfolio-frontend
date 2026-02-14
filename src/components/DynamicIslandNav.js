import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import './DynamicIslandNav.css';

const menuItems = [
  { name: 'About', id: 'about' },
  { name: 'Expertise', id: 'skills' },
  { name: 'Companies', id: 'projects' },
  { name: 'Media', id: 'experience' },
  { name: 'Leadership', id: 'academics' },
  { name: 'Impact', id: 'certifications' },
  { name: 'Services', id: 'services' }
];

const connectOptions = [
  { name: 'LinkedIn', icon: '💼', url: 'https://www.linkedin.com/in/nikhilkamathcio' },
  { name: 'Email', icon: '📧', url: 'mailto:nikhil.k@zerodha.com' },
  { name: 'Twitter', icon: '𝕏', url: 'https://twitter.com/nikhilkamathcio' },
  { name: 'Schedule', icon: '📅', url: '#contact' }
];

const DynamicIslandNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [isConnectHovered, setIsConnectHovered] = useState(false);
  const [isConnectExpanded, setIsConnectExpanded] = useState(false);
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    // Always show navigation on non-homepage
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);

      // Detect current section (only on homepage)
      const sections = menuItems.map(item => item.id);
      for (let section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHomePage]);

  const scrollToSection = (id) => {
    if (!isHomePage) {
      // If not on homepage, navigate to homepage first, then scroll
      navigate('/', { state: { scrollTo: id } });
    } else {
      // If on homepage, scroll directly
      const element = document.getElementById(id);
      if (element) {
        const offset = 100;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleLogoClick = () => {
    if (isHomePage) {
      // If on homepage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If on another page, navigate to homepage
      navigate('/');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="dynamic-island-container"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 0.6
          }}
        >
          {/* Main Navigation Island */}
          <motion.nav
            animate={{
              width: isConnectHovered ? '20%' : '68%'
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="main-island"
          >
            <div className="island-content">
              {/* Glow Effect */}
              <div className="island-glow" />

              {/* Logo/Profile Section */}
              <motion.button
                onClick={handleLogoClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="island-logo"
                title={isHomePage ? 'Scroll to top' : 'Back to homepage'}
              >
                <div className="logo-image">
                  <img
                    src="/images/IMG3.JPG"
                    alt="Nikhil kamath"
                  />
                </div>
                <AnimatePresence mode="wait">
                  {!isConnectHovered && (
                    <motion.span
                      key="logo-text"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="logo-text"
                    >
                      Nikhil Kamath
                    </motion.span>
                  )}
                  
                </AnimatePresence>
              </motion.button>

              {/* Divider */}
              <AnimatePresence>
                {!isConnectHovered && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="island-divider"
                  />
                )}
              </AnimatePresence>

              {/* Navigation Menu */}
              <AnimatePresence>
                {!isConnectHovered && (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="island-menu"
                  >
                    {menuItems.map((item) => (
                      <motion.button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`menu-item ${currentSection === item.id ? 'active' : ''}`}
                      >
                        {currentSection === item.id && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="active-indicator"
                            transition={{
                              type: 'spring',
                              stiffness: 400,
                              damping: 30
                            }}
                          />
                        )}
                        <span className="menu-item-text">{item.name}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>

          {/* Connect Island */}
          <motion.div
            animate={{
              width: isConnectHovered ? '66%' : '18%'
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className="connect-island"
            onMouseEnter={() => {
              setIsConnectHovered(true);
              setTimeout(() => setIsConnectExpanded(true), 100);
            }}
            onMouseLeave={() => {
              setIsConnectExpanded(false);
              setTimeout(() => setIsConnectHovered(false), 100);
            }}
          >
            <div className="island-content">
              {/* Glow Effect */}
              <div className="island-glow" />

              {/* Connect Button */}
              <div className="connect-content">
                <motion.div
                  className="connect-icon"
                  animate={{ rotate: isConnectExpanded ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </motion.div>

                <AnimatePresence mode="wait">
                  {!isConnectExpanded ? (
                    <motion.span
                      key="connect-text"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="connect-text"
                    >
                      Connect
                    </motion.span>
                  ) : (
                    <motion.div
                      key="connect-options"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="connect-options"
                    >
                      {connectOptions.map((option, index) => (
                        <motion.a
                          key={option.name}
                          href={option.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="connect-option"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.06, duration: 0.2 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="option-icon">{option.icon}</span>
                          <span className="option-name">{option.name}</span>
                        </motion.a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DynamicIslandNav;
