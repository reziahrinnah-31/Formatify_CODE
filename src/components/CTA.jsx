import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CTA.css';

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="cta-section">
      <div className="cta-bg-orb" />
      <h2>Ready To Format Your Academic Report?</h2>
      <p>Generate perfectly formatted reports.</p>

      <button
        className="cta-main-btn"
        onClick={() => navigate('/login')}
      >
        Start Formatting Now →
      </button>
    </section>
  );
};

export default CTA;