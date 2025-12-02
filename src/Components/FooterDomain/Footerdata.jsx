import React from 'react';
import { FaFacebookF, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { HiMail, HiPhone } from 'react-icons/hi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Newsletter Column */}
        <div className="footer-col newsletter-col">
          <h3>NEWSLETTER SUBSCRIBE</h3>
          <div className="divider"></div>
          <p className="email-label">EMAIL ADDRESS</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email address" />
            <button>Sign Up</button>
          </div>
        </div>

        {/* Contact Column */}
        <div className="footer-col contact-col">
          <h3>CONTACT US</h3>
          <div className="divider"></div>
          <h4>Mitha Construction and Development</h4>
          <p>
            <FaMapMarkerAlt className="contact-icon" />
            C-87, 1st Floor, Sashmi Road
          </p>
          <p>
            <FaMapMarkerAlt className="contact-icon" />
            Thillahagar, Thohy - 800.018
          </p>
          <p className="contact-detail">
            <FaPhone className="contact-icon" />
            +91 99949 24502 / +91 94431 64732
          </p>
          <p className="contact-detail">
            <HiPhone className="contact-icon" />
            +91 431 4210732
          </p>
          <p className="contact-detail">
            <FaEnvelope className="contact-icon" />
            mithahomesales@gmail.com
          </p>
        </div>

        {/* Useful Links Column */}
        <div className="footer-col links-col">
          <h3>USEFUL LINKS</h3>
          <div className="divider"></div>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Vision & Mission</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Social Media Column */}
        <div className="footer-col social-col">
          <h3>FOLLOW US</h3>
          <div className="divider"></div>
          <div className="social-icons">
            <a href="#" className="social-icon facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-icon instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-icon youtube">
              <FaYoutube />
            </a>
          </div>
          <p className="social-follow">Follow us on social media for updates</p>
        </div>
      </div>

      {/* Footer Bottom Section with #074039 background */}
      <div className="footer-bottom">
        <nav className="footer-nav">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Blog</a>
          <a href="#">Our Projects</a>
          <a href="#">Contact Us</a>
        </nav>
        <p className="copyright">All Rights Reserved. Copyright 2012 mithahomes.com</p>
      </div>
    </footer>
  );
};

export default Footer;