import React from 'react';
import './Problems.css';

const problems = [
  { icon: '📐', label: 'Incorrect Margins' },
  { icon: '↕', label: 'Wrong Line Spacing' },
  { icon: '📄', label: 'Header/Footer Issues' },
  { icon: '#', label: 'Page Number Errors' },
  { icon: '✍', label: 'Manual Formatting' },
];

const Problems = () => (
  <section className="problems-section">
    <h2 className="section-title">Stop Wasting Hours Formatting Reports</h2>
    <p className="section-sub">Common problems students face every day</p>

    <div className="problems-grid">
      {problems.map((p, i) => (
        <div className="problem-card" key={i}>
          <div className="problem-icon">{p.icon}</div>
          <span>{p.label}</span>
        </div>
      ))}
    </div>

    <div className="problems-fix">
      <span></span> Formatify fixes everything automatically.
    </div>
  </section>
);

export default Problems;