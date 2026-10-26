import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="hero" id="home">
      {/* Background orbs */}
      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />

      <div className="hero-left fade-up">
        <h1>
          Format <span>Report.</span>
        </h1>

        <p>
          Upload your Word document, choose a format, and instantly generate a
          professionally formatted academic report with proper margins, spacing,
          headers, footers, page numbering, and alignment.
        </p>

        <div className="hero-actions">
          <button
            className="cta-btn glow"
            onClick={() => navigate('/login')}
          >
            Start Formatting
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat"><p>Reports Formatted</p></div>
          <div className="stat-divider" />
          <div className="stat"><p>Standards Supported</p></div>
          <div className="stat-divider" />
          <div className="stat"><p>Free to Use</p></div>
        </div>
      </div>

      <div className="hero-right float">
        <div className="mock-card">
          <div className="mock-card__header">
            <div className="mock-card__dot red" />
            <div className="mock-card__dot yellow" />
            <div className="mock-card__dot green" />
            <span>Document Formatter</span>
          </div>

          <div className="mock-upload">
            <div className="upload-icon">📄</div>
            <p>Upload DOCX</p>
            <span>Drag & drop or click to browse</span>
          </div>

          <div className="mock-template">
            <label>Select Template</label>
            <select>
              <option>MCA Format</option>
              <option>BCA Format</option>
            </select>
          </div>

          <div className="mock-progress">
            <div className="progress-label">
              <span>Formatting Progress</span>
              <span className="progress-pct">96%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: '96%' }}
              />
            </div>
          </div>

          <button
            className="mock-download"
            onClick={() => navigate('/login')}
          >
            ⬇ Download Formatted Report
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;