import React from 'react';
import './HowItWorks.css';

const steps = [
  { step: '01', icon: '⬆', title: 'Upload Document', desc: 'Upload your Word file (.docx)' },
  { step: '02', icon: '📋', title: 'Select Template', desc: 'Choose MCA or BCA format' },
  { step: '03', icon: '👁', title: 'Preview Report', desc: 'Review formatted document' },
  { step: '04', icon: '⬇', title: 'Download DOCX', desc: 'Get your formatted file' },
];

const HowItWorks = () => (
  <section className="hiw-section" id="about">
    <h2 className="section-title">How It Works</h2>
    <p className="section-sub">Four simple steps to perfect formatting</p>

    <div className="hiw-steps">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <div className="hiw-card">
            <div className="hiw-step-num">{s.step}</div>
            <div className="hiw-icon">{s.icon}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
          {i < steps.length - 1 && <div className="hiw-connector">→</div>}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export default HowItWorks;