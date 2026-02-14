import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageFormModal from './MessageFormModal';
import AIChatModal from './AIChatModal';
import './FloatingContact.css';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleBlogClick = () => {
    window.location.href = '/blog';
  };

  return (
    <>
      {/* Floating Action Buttons Container */}
      <motion.div
        className="floating-actions-container"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="floating-buttons-stack">
          {/* AI Assistant Button */}
          <motion.button
            className="floating-action-btn ai-btn"
            onClick={() => setIsChatOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="AI Assistant"
            title="Ask our AI Assistant"
          >
            <div className="btn-glow" />
            <div className="btn-content">
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 2L11 7L16 8.5L11 10L9.5 15L8 10L3 8.5L8 7L9.5 2Z"
                  fill="currentColor"
                />
                <path
                  d="M18 12L19 15L22 16L19 17L18 20L17 17L14 16L17 15L18 12Z"
                  fill="currentColor"
                />
                <path
                  d="M5 16L5.5 17.5L7 18L5.5 18.5L5 20L4.5 18.5L3 18L4.5 17.5L5 16Z"
                  fill="currentColor"
                />
              </svg>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="btn-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    AI Chat
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Blog Button */}
          <motion.button
            className="floating-action-btn blog-btn"
            onClick={handleBlogClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Visit Blog"
            title="Read our latest insights"
          >
            <div className="btn-glow" />
            <div className="btn-content">
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                
              >
                <path
                  d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"
                  fill="currentColor"
                />
              </svg>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="btn-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Blog
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Message Button */}
          <motion.button
            className="floating-action-btn message-btn"
            onClick={openModal}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Send Message"
            title="Connect with us"
          >
            <div className="btn-glow" />
            <div className="btn-content">
              <svg
                className="btn-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"
                  fill="currentColor"
                />
              </svg>
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    className="btn-label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Message
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Message Form Modal */}
      <MessageFormModal isOpen={isOpen} onClose={closeModal} />

      {/* AI Chat Modal */}
      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};

export default FloatingContact;
