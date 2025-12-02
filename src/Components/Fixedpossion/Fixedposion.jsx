import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import './ActionButtons.css';

const ActionButtons = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  return (
    <div className={`action-buttons-full-width ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="container-fluid action-bar-container">
        <div className="action-bar">
          
          <a href="#" className="action-button enquire">
            <FontAwesomeIcon icon={faEnvelope} className="icon" />
            <span className="text">ENQUIRE NOW</span>
          </a>

          <a href="tel:0000000000" className="action-button contact">
            <FontAwesomeIcon icon={faPhoneAlt} className="icon" />
            <span className="text">CONTACT US</span>
          </a>

          <a 
            href="https://wa.me/0000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="action-button whatsapp"
          >
            <FontAwesomeIcon icon={faWhatsapp} className="icon" />
            <span className="text">CHAT IN WHATSAPP</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;