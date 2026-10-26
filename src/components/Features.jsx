import React from 'react';
import './Features.css';

const features = [
  {
    icon: '⚡',
    title: 'Auto Formatting',
    desc: 'Automatically applies formatting rules throughout the entire document with a single click.',
  },
  {
    icon: '📋',
    title: 'Templates',
    desc: 'Preconfigured templates based on college requirements for MCA and BCA reports.',
  },
  {
    icon: '📦',
    title: 'Large Document Support',
    desc: 'Format reports from 1 page to 250 pages without any performance issues.',
  },
  {
    icon: '⚙️',
    title: 'Custom Settings',
    desc: 'Adjust spacing, margins, fonts, and alignment before downloading your document.',
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <h2 className="section-title">Powerful Features</h2>
    <p className="section-sub">Everything you need to format academic reports</p>

    <div className="features-grid">
      {features.map((f, i) => (
        <div className="feature-card" key={i}>
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;