import { useState } from 'react';
import { getTemplates, setTemplates, updateTemplate, deleteTemplate } from '../../utils/store';
import { Icon } from '../AdminDashboard'; // or move Icon to a shared file
// ── Tiny SVG icons ────────────────────────────────────────────
const I = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" style={{ display:'inline-block', verticalAlign:'middle' }}>
    {d}
  </svg>
);
const EyeIcon   = ({ size }) => <I size={size} d={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>} />;
const EditIcon  = ({ size }) => <I size={size} d={<><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>} />;
const TrashIcon = ({ size }) => <I size={size} d={<><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>} />;
const FileIcon  = ({ size }) => <I size={size} d={<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>} />;
const SaveIcon  = ({ size }) => <I size={size} d={<><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></>} />;
const PlusIcon  = ({ size }) => <I size={size} d={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />;

// ── A4 document mockup (used in preview modal) ────────────────
const A4Mockup = ({ tmpl }) => (
  <div style={{
    background: '#fff', borderRadius: 8, padding: '20px 24px',
    fontFamily: tmpl.font || 'Times New Roman', color: '#1a1a1a',
    border: '1.5px solid #ccc',
  }}>
    {/* Header */}
    <div style={{ display:'flex', alignItems:'center', gap:10, borderBottom:'2px solid #111', paddingBottom:10, marginBottom:14 }}>
      <div style={{
        width:38, height:38, borderRadius:'50%', background:'#c8102e',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:900, color:'#fff', flexShrink:0,
      }}>KJ</div>
      <div>
        <div style={{ fontSize:11, fontWeight:700, lineHeight:1.4 }}>{tmpl.header || 'K.J. College'}</div>
        <div style={{ fontSize:9, color:'#888' }}>{tmpl.dept} Department</div>
      </div>
    </div>

    {/* Title block */}
    <div style={{ textAlign:'center', marginBottom:14, paddingBottom:10, borderBottom:'1px solid #eee' }}>
      <div style={{ fontSize:13, fontWeight:700 }}>{tmpl.name}</div>
      <div style={{ fontSize:9, color:'#888', marginTop:3 }}>Student Name — Roll No</div>
    </div>

    {/* Body lines */}
    {[100,85,92,70,88,76,94,82,68,90].map((w, i) => (
      <div key={i} style={{ height:5, borderRadius:2, background:'#e8e8e8', width:`${w}%`, marginBottom:7 }} />
    ))}

    {/* Footer */}
    <div style={{ borderTop:'1px solid #ddd', marginTop:14, paddingTop:7, display:'flex', justifyContent:'space-between', fontSize:9, color:'#999' }}>
      <span>{tmpl.footer || 'Academic Year 2025-2026'}</span>
      <span>Page 1</span>
    </div>
  </div>
);

// ── Preview Modal ─────────────────────────────────────────────
const PreviewModal = ({ tmpl, onClose, onEdit }) => (
  <div className="a-modal-overlay" onClick={onClose}>
    <div className="a-modal-box" style={{ width: 580, textAlign:'left' }} onClick={e => e.stopPropagation()}>
      <button className="a-modal-close" onClick={onClose}>✕</button>
      <h2 style={{ fontSize:20, fontWeight:900, marginBottom:18 }}>{tmpl.name}</h2>

      <A4Mockup tmpl={tmpl} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, margin:'18px 0' }}>
        {[
          ['Paper Size', 'A4'],
          ['Font', tmpl.font || 'Times New Roman'],
          ['Line Spacing', tmpl.spacing || '1.5'],
          ['Margins', '1 inch all sides'],
          ['Department', tmpl.dept],
          ['Page Numbers', tmpl.pageNum || 'Bottom Center'],
        ].map(([k, v]) => (
          <div key={k} style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:9, padding:'12px 14px' }}>
            <div style={{ fontSize:11, color:'var(--text3)', marginBottom:4 }}>{k}</div>
            <div style={{ fontSize:13, fontWeight:700 }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid var(--border)' }}>
        <button className="a-modal-cancel" onClick={onClose}>Close</button>
        <button className="a-save-btn" onClick={onEdit} style={{ padding:'11px 22px', fontSize:13 }}>
          <EditIcon size={14} /> Edit Template
        </button>
      </div>
    </div>
  </div>
);

// ── Edit Modal ────────────────────────────────────────────────
const EditModal = ({ tmpl, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name:    tmpl.name,
    dept:    tmpl.dept,
    font:    tmpl.font    || 'Times New Roman',
    spacing: tmpl.spacing || '1.5',
    header:  tmpl.header  || '',
    footer:  tmpl.footer  || '',
    pageNum: tmpl.pageNum || 'bottom-center',
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { alert('Template name is required'); return; }
    updateTemplate(tmpl.id, form);
    onSaved();
  };

  return (
    <div className="a-modal-overlay" onClick={onClose}>
      <div className="a-modal-box" style={{ width:560, textAlign:'left', maxHeight:'85vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
        <button className="a-modal-close" onClick={onClose}>✕</button>
        <h2 style={{ fontSize:20, fontWeight:900, marginBottom:20 }}>Edit Template</h2>

        {[
          { label:'Template Name', id:'name', type:'input', placeholder:'Template name' },
        ].map(f => (
          <div className="a-form-group" key={f.id}>
            <label>{f.label}</label>
            <input className="a-form-input" value={form[f.id]} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} />
          </div>
        ))}

        <div className="a-form-group">
          <label>Department</label>
          <select className="a-form-select" value={form.dept} onChange={e => set('dept', e.target.value)}>
            <option value="MCA">MCA</option>
            <option value="BCA">BCA</option>
          </select>
        </div>

        <div className="a-form-row">
          <div className="a-form-group" style={{ marginBottom:0 }}>
            <label>Font Family</label>
            <select className="a-form-select" value={form.font} onChange={e => set('font', e.target.value)}>
              {['Times New Roman','Arial','Calibri'].map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="a-form-group" style={{ marginBottom:0 }}>
            <label>Line Spacing</label>
            <select className="a-form-select" value={form.spacing} onChange={e => set('spacing', e.target.value)}>
              {['1.0','1.5','2.0'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="a-form-group" style={{ marginTop:16 }}>
          <label>Header Text</label>
          <input className="a-form-input" value={form.header} onChange={e => set('header', e.target.value)} />
        </div>
        <div className="a-form-group">
          <label>Footer Text</label>
          <input className="a-form-input" value={form.footer} onChange={e => set('footer', e.target.value)} />
        </div>
        <div className="a-form-group">
          <label>Page Number Position</label>
          <select className="a-form-select" value={form.pageNum} onChange={e => set('pageNum', e.target.value)}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-right">Top Right</option>
          </select>
        </div>

        {/* Fixed info notice */}
        <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:9, padding:'12px 14px', marginBottom:14, fontSize:12, color:'var(--text2)', display:'flex', gap:8, alignItems:'center' }}>
          ℹ️ A4 paper, 1-inch margins and KJ College logo are fixed on all templates.
        </div>

        <div style={{ display:'flex', gap:10, justifyContent:'flex-end', paddingTop:16, borderTop:'1px solid var(--border)' }}>
          <button className="a-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="a-save-btn" onClick={handleSave} style={{ padding:'11px 22px', fontSize:13 }}>
            <SaveIcon size={14} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const TemplatesPage = ({ setActivePage }) => {
  const [filter,   setFilter]   = useState('all');
  const [templates, setTmpls]   = useState(getTemplates);
  const [preview,  setPreview]  = useState(null);
  const [editing,  setEditing]  = useState(null);

  const refresh = () => setTmpls(getTemplates());

  const handleDelete = (id) => {
    if (!window.confirm('Delete this template? Students will no longer see it.')) return;
    deleteTemplate(id);
    refresh();
  };

  const handleSaved = () => {
    setEditing(null);
    refresh();
  };

  const filtered = filter === 'all' ? templates : templates.filter(t => t.dept === filter.toUpperCase());

  return (
    <>
      <main className="a-content">
        <div className="a-page-top">
          <div>
            <h1 className="a-page-title">Manage Templates</h1>
            <p className="a-page-sub" style={{ marginBottom:0 }}>Create, preview and edit formatting templates</p>
          </div>
          <button className="a-add-btn" onClick={() => setActivePage('create')}>
            <PlusIcon size={14} /> Add Template
          </button>
        </div>

        {/* Filters */}
        <div className="a-filters">
          {['all','mca','bca'].map(f => (
            <button key={f} className={`a-filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="a-tmpl-stat">
          <span>Total Templates</span>
          <strong>{filtered.length}</strong>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
            <p style={{ color:'var(--text3)' }}>No templates found. <button className="card-link red" onClick={() => setActivePage('create')}>Create one →</button></p>
          </div>
        ) : (
          <div className="a-tmpl-grid">
            {filtered.map(t => (
              <div className="a-tmpl-card" key={t.id}>
                <div className="a-tmpl-card-top">
                  <span className="a-tmpl-card-icon"><FileIcon size={22} /></span>
                  <span className="a-active-badge">Active</span>
                </div>
                <h3>{t.name}</h3>
                <div className="a-tmpl-card-dept">{t.dept} Department</div>
                <div className="a-tmpl-card-date">Updated: {t.updated}</div>
                <div style={{ fontSize:12, color:'var(--text3)', marginBottom:14 }}>
                  Font: {t.font} &nbsp;·&nbsp; Spacing: {t.spacing} &nbsp;·&nbsp; {t.paper}
                </div>
                <div className="a-tmpl-card-actions">
                  <button className="a-tmpl-action-btn" onClick={() => setPreview(t)}>
                    <EyeIcon size={13} /> Preview
                  </button>
                  <button className="a-tmpl-action-btn" onClick={() => setEditing(t)}>
                    <EditIcon size={13} /> Edit
                  </button>
                  <button className="a-tmpl-delete-btn" onClick={() => handleDelete(t.id)}>
                    <TrashIcon size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {preview && (
        <PreviewModal
          tmpl={preview}
          onClose={() => setPreview(null)}
          onEdit={() => { setEditing(preview); setPreview(null); }}
        />
      )}
      {editing && (
        <EditModal
          tmpl={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default TemplatesPage;