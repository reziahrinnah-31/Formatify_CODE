import React from 'react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="footer-logo-icon">F</span>
          FORMATIFY<span className="red"></span>
        </div>
        <p>Academic document formatting made simple.</p>
      </div>

      <div className="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Student Resources</h4>
        <ul>
          <li><a href="#">MCA Guidelines</a></li>
          <li><a href="#">BCA Guidelines</a></li>
          <li><a href="#">Formatting Tips</a></li>
        </ul>
      </div>

      <div className="footer-col">
        <h4>Contact Us</h4>
        <ul>
          <li><a href="mailto:23MCAC40@krishijayanti.com">23MCAC40@krishijayanti.com</a></li>
          <li><a href="mailto:23MCAC23@krishijayanti.com">23MCAC23@krishijayanti.com</a></li>
        </ul>
      </div>
    </div>

    <div className="footer-bottom">
      <p>© 2026 Formatify. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;