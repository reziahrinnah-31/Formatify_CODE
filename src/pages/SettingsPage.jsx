import { useState } from 'react';
import { Icon } from '../AdminDashboard';
import { getSettings, saveSettings, getTemplates } from '../../utils/store';

const SettingsPage = () => {
  const templates = getTemplates();
  const initial   = getSettings();

  const [maxSize,     setMaxSize]     = useState(initial.maxSize ?? '50');
  const [defaultTmpl, setDefaultTmpl] = useState(String(initial.defaultTmpl ?? templates[0]?.id ?? ''));
  const [allowDocx,   setAllowDocx]   = useState(initial.allowDocx ?? true);
  const [allowDoc,    setAllowDoc]    = useState(initial.allowDoc  ?? true);
  const [saved,       setSaved]       = useState(false);

  const handleSave = () => {
    saveSettings({ maxSize, defaultTmpl, allowDocx, allowDoc });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <main className="a-content">
      <h1 className="a-page-title">Platform Settings</h1>
      <p className="a-page-sub">Configure platform-wide settings</p>

      <div className="a-settings-wrap">

        {/* Upload Settings */}
        <div className="a-settings-section">
          <div className="a-settings-section-title">
            <div className="a-settings-icon-wrap upload">📤</div>
            Upload Settings
          </div>

          <div className="a-form-group">
            <label style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:8, display:'block' }}>
              Maximum File Size (MB)
            </label>
            <input
              className="a-form-input"
              type="number"
              min="1"
              max="200"
              value={maxSize}
              onChange={e => setMaxSize(e.target.value)}
              style={{ maxWidth: 130 }}
            />
          </div>

          <div className="a-form-group">
            <label style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:10, display:'block' }}>
              Allowed File Types
            </label>
            <div style={{ display:'flex', gap:10 }}>
              {[
                { label:'.docx', checked:allowDocx, onChange:setAllowDocx },
                { label:'.doc',  checked:allowDoc,  onChange:setAllowDoc  },
              ].map(({ label, checked, onChange }) => (
                <label key={label} style={{
                  display:'flex', alignItems:'center', gap:8,
                  background:'var(--surface2)', border:'1px solid var(--border)',
                  padding:'8px 14px', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:700,
                }}>
                  <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Template Settings */}
        <div className="a-settings-section">
          <div className="a-settings-section-title">
            <div className="a-settings-icon-wrap template">📋</div>
            Template Settings
          </div>

          <div className="a-form-group">
            <label style={{ fontSize:13, fontWeight:700, color:'var(--text)', marginBottom:8, display:'block' }}>
              Default Template
            </label>
            <select
              className="a-form-select"
              value={defaultTmpl}
              onChange={e => setDefaultTmpl(e.target.value)}
              style={{ maxWidth: 320 }}
            >
              {templates.map(t => (
                <option key={t.id} value={String(t.id)}>{t.name}</option>
              ))}
            </select>
            <p className="a-settings-note">Pre-selected for new students on the Choose Template page</p>
          </div>
        </div>

      </div>

      <button className="a-save-changes-btn" onClick={handleSave}>
        {saved ? '✓ Saved!' : '💾 Save Changes'}
      </button>
    </main>
  );
};

export default SettingsPage;