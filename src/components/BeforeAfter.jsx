import React, { useState } from 'react';
import './BeforeAfter.css';

const BeforeAfter = () => {
  const [drag, setDrag] = useState(50);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const pct = Math.min(Math.max((x / rect.width) * 100, 5), 95);
    setDrag(pct);
  };

  return (
    <section className="ba-section">
      <h2 className="section-title">Before & After</h2>
      <p className="section-sub">See the transformation — drag the slider</p>

      <div
        className="ba-slider"
        onMouseMove={handleMove}
        onTouchMove={handleMove}
      >
        {/* BEFORE */}
        <div className="ba-panel ba-before">
          <div className="ba-label">Kristu Jayanti College</div>
          <div className="ba-doc ba-doc--messy">
            <div className="doc-line short" />
            <div className="doc-line" />
            <div className="doc-line medium" />
            <div className="doc-line" />
            <div className="doc-line short" />
            <div className="doc-line" />
            <div className="doc-line long" />
            <div className="doc-icon">📄<p>Kristu Jayanti College</p></div>
          </div>
        </div>

        {/* AFTER (clipped) */}
        <div className="ba-panel ba-after" style={{ width: `${drag}%` }}>
          <div className="ba-label ba-label--red">Kristu Jayanti Deemed To BE University</div>

          <div className="ba-doc ba-doc--clean">
            
            <div className="ba-label">Formating Documents</div>
            <div className="ba-label">Alignment</div>
            <div className="clean-line short" />
            <div className="clean-line" />
            <div className="clean-line medium" />
            <div className="clean-footer" />
            <div className="clean-page">Page 1</div>
          </div>
        </div>

        {/* Divider handle */}
        <div className="ba-handle" style={{ left: `${drag}%` }}>
          <div className="handle-circle">⟺</div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;