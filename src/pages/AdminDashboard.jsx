import { useState, useCallback } from "react";
import { getTemplates, getUsers, getDocsFormatted, addTemplate, deleteTemplate, updateTemplate } from '../utils/store';

// ✅ Import the real CreateTemplatePage (with your logo + correct A4 layout)

import CreateTemplatePage from './CreateTemplatePage';

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --red: #c8102e; --red-dark: #a40d24;
    --red-dim: rgba(200,16,46,0.12); --red-border: rgba(200,16,46,0.25);
    --gold: #c8a020; --gold-dim: rgba(200,160,32,0.12); --gold-border: rgba(200,160,32,0.25);
    --green: #2ecc71; --blue: #4ab8e8;
    --bg: #0a0a0a; --surface: #111111; --surface2: #181818; --surface3: #1e1e1e;
    --border: rgba(255,255,255,0.06); --border2: rgba(255,255,255,0.1);
    --text: #ffffff; --text2: #aaaaaa; --text3: #e3dbdb; --text4: #fffcfc;
  }
  body { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); }
  .a-layout { display: flex; min-height: 100vh; }
  .a-sidebar {
  width: 60px; flex-shrink: 0; background: #0d0d0d;
  border-right: 1px solid var(--border); display: flex; flex-direction: column;
  position: sticky; top: 0; height: 100vh; overflow: hidden;
  transition: width 0.25s cubic-bezier(0.4,0,0.2,1); z-index: 100;
}
.a-sidebar:hover { width: 220px; }
  .a-sidebar-logo {
  display: flex; align-items: center; gap: 10px; padding: 20px 13px 14px;
  border-bottom: 1px solid var(--border); overflow: hidden; white-space: nowrap;
}
.a-logo-text-wrap { opacity: 0; transition: opacity 0.2s ease 0.05s; white-space: nowrap; }
.a-sidebar:hover .a-logo-text-wrap { opacity: 1; }
  .a-logo-icon { width: 34px; height: 34px; border-radius: 8px; background: var(--red); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: white; flex-shrink: 0; }
  .a-logo-name { font-size: 14px; font-weight: 900; letter-spacing: 2px; color: white; }
  .a-logo-sub { font-size: 10px; color: var(--text3); letter-spacing: 1px; margin-top: 1px; }
  .a-nav { display: flex; flex-direction: column; padding: 14px 10px; gap: 2px; flex: 1; }
  .a-nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 11px; border-radius: 10px; background: transparent; border: none; color: var(--text3); font-size: 13.5px; font-weight: 600; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; overflow: hidden; white-space: nowrap; }
.a-nav-label { opacity: 0; transition: opacity 0.2s ease 0.05s; white-space: nowrap; overflow: hidden; }
.a-sidebar:hover .a-nav-label { opacity: 1; }
  .a-nav-item:hover { background: rgba(255,255,255,0.04); color: #c6c1c1; }
  .a-nav-item.active { background: var(--red) !important; color: white !important; }
  .a-nav-icon { font-size: 16px; width: 18px; text-align: center; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .a-nav-logout { margin-top: auto; }
  .a-nav-logout:hover { color: var(--red); background: var(--red-dim) !important; }
  .a-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }
  .a-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 36px; border-bottom: 1px solid var(--border); background: #0d0d0d; position: sticky; top: 0; z-index: 20; flex-shrink: 0; }
  .a-header h3 { font-size: 15px; font-weight: 700; color: white; margin-bottom: 2px; }
  .a-header p { font-size: 12px; color: var(--text3); }
  .a-header-right { display: flex; align-items: center; gap: 10px; }
  .a-header-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--text2); cursor: pointer; }
  .a-header-name { font-size: 14px; font-weight: 700; }
  .a-content { padding: 36px; flex: 1; overflow-y: auto; }
  .a-page-title { font-size: 32px; font-weight: 900; margin-bottom: 6px; }
  .a-page-sub { color: var(--text3); font-size: 14px; margin-bottom: 28px; }
  .a-stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .a-stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 22px 20px; cursor: pointer; transition: border-color 0.2s; }
  .a-stat-card:hover { border-color: var(--border2); }
  .a-stat-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .a-stat-num { font-size: 30px; font-weight: 900; margin-bottom: 4px; }
  .a-stat-label { font-size: 13px; color: var(--text3); }
  .a-activity-box { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 26px; }
  .a-activity-box h2 { font-size: 16px; font-weight: 800; margin-bottom: 18px; }
  .a-page-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .a-add-btn { background: var(--red); border: none; color: white; padding: 12px 22px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; }
  .a-add-btn:hover { background: var(--red-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,16,46,0.35); }
  .a-filters { display: flex; gap: 8px; margin-bottom: 20px; }
  .a-filter-btn { background: var(--surface); border: 1px solid var(--border); color: var(--text3); padding: 7px 18px; border-radius: 20px; font-size: 13px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; }
  .a-filter-btn:hover { color: white; border-color: var(--border2); }
  .a-filter-btn.active { background: var(--red); border-color: var(--red); color: white; }
  .a-tmpl-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 22px; display: inline-block; margin-bottom: 24px; }
  .a-tmpl-stat span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 4px; }
  .a-tmpl-stat strong { font-size: 26px; font-weight: 900; }
  .a-tmpl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
  .a-tmpl-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px; transition: all 0.3s; }
  .a-tmpl-card:hover { border-color: rgba(200,16,46,0.3); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.3); }
  .a-tmpl-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
  .a-tmpl-card-icon { color: var(--red); }
  .a-active-badge { background: rgba(46,204,113,0.12); border: 1px solid rgba(46,204,113,0.25); color: var(--green); padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .a-tmpl-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 5px; }
  .a-tmpl-card-dept { font-size: 12px; color: var(--text3); margin-bottom: 6px; }
  .a-tmpl-card-date { font-size: 11px; color: var(--text4); margin-bottom: 18px; }
  .a-tmpl-card-actions { display: flex; align-items: center; gap: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
  .a-tmpl-action-btn { background: none; border: none; color: var(--text3); font-size: 12px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: color 0.2s; }
  .a-tmpl-action-btn:hover { color: white; }
  .a-tmpl-action-btn.gold { color: var(--gold); }
  .a-tmpl-action-btn.gold:hover { color: #f0c040; }
  .a-tmpl-delete-btn { background: none; border: none; color: var(--red); font-size: 12px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: opacity 0.2s; margin-left: auto; }
  .a-tmpl-delete-btn:hover { opacity: 0.7; }
  .a-users-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
  .a-users-stat { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; }
  .a-users-stat span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 6px; }
  .a-users-stat strong { font-size: 24px; font-weight: 900; }
  .a-users-stat strong.green { color: var(--green); }
  .a-users-stat strong.red { color: var(--red); }
  .a-users-stat strong.gold { color: var(--gold); }
  .a-users-table-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .a-users-table { width: 100%; border-collapse: collapse; }
  .a-users-table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 700; color: var(--text3); border-bottom: 1px solid var(--border); background: var(--surface2); }
  .a-users-table td { padding: 16px 20px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .a-users-table tr:last-child td { border-bottom: none; }
  .a-users-table tr:hover td { background: rgba(255,255,255,0.02); }
  .a-user-avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; flex-shrink: 0; }
  .a-user-name-cell { display: flex; align-items: center; gap: 12px; }
  .a-dept-badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .a-dept-badge.mca { background: var(--red-dim); color: var(--red); }
  .a-dept-badge.bca { background: var(--gold-dim); color: var(--gold); }
  .a-settings-wrap { max-width: 700px; }
  .a-settings-section { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 18px; }
  .a-settings-section-title { display: flex; align-items: center; gap: 12px; font-size: 17px; font-weight: 800; margin-bottom: 24px; }
  .a-settings-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .a-settings-icon-wrap.upload { background: rgba(200,16,46,0.12); }
  .a-settings-icon-wrap.template { background: rgba(46,204,113,0.12); }
  .a-settings-note { font-size: 12px; color: var(--text3); margin-top: 8px; }
  .a-save-changes-btn { background: var(--red); border: none; color: white; padding: 13px 28px; border-radius: 10px; font-size: 13px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; position: fixed; bottom: 32px; right: 36px; }
  .a-save-changes-btn:hover { background: var(--red-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,16,46,0.35); }
  .a-profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; }
  .a-profile-left { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 32px 24px; text-align: center; }
  .a-profile-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #ff6b35, #c8102e); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; color: white; margin: 0 auto 16px; }
  .a-profile-left h2 { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
  .a-system-admin-badge { display: inline-block; background: var(--gold-dim); border: 1px solid var(--gold-border); color: var(--gold); padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 22px; }
  .a-profile-left-details { text-align: left; border-top: 1px solid var(--border); padding-top: 18px; display: flex; flex-direction: column; gap: 14px; }
  .a-profile-detail span { display: block; font-size: 11px; color: var(--text4); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .a-profile-detail strong { font-size: 13px; font-weight: 700; }
  .a-profile-detail strong.gold { color: var(--gold); }
  .a-profile-right { display: flex; flex-direction: column; gap: 16px; }
  .a-profile-info-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
  .a-profile-info-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 22px; }
  .a-profile-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .a-profile-info-field span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text3); font-weight: 600; margin-bottom: 6px; }
  .a-profile-info-field .field-val { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-size: 13px; color: var(--text2); }
  .a-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: aFadeIn 0.2s ease; }
  @keyframes aFadeIn { from { opacity: 0; } to { opacity: 1; } }
  .a-modal-box { background: #141414; border: 1px solid rgba(201, 182, 182, 0.51); border-radius: 20px; padding: 44px 44px 36px; width: 420px; text-align: center; position: relative; animation: aSlideUp 0.25s ease; }
  @keyframes aSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .a-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text3); font-size: 18px; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .a-modal-close:hover { background: rgba(255,255,255,0.06); color: white; }
  .a-modal-warn-icon { width: 72px; height: 72px; border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 22px; }
  .a-modal-box h2 { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
  .a-modal-box p { font-size: 14px; color: var(--text3); line-height: 1.6; margin-bottom: 28px; }
  .a-modal-buttons { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
  .a-modal-cancel { background: none; border: 1px solid var(--border2); color: white; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; flex: 1; }
  .a-modal-cancel:hover { background: rgba(255,255,255,0.05); }
  .a-modal-confirm { background: var(--red); border: none; color: white; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center; }
  .a-modal-confirm:hover { background: var(--red-dark); }
  .a-modal-note { font-size: 12px; color: var(--text4); }
  .a-empty-state { text-align: center; padding: 60px 20px; background: var(--surface); border-radius: 16px; border: 1px solid var(--border); }
  .a-empty-state div { font-size: 40px; margin-bottom: 12px; }
  .a-empty-state p { color: var(--text3); font-size: 14px; }

  /* ct-input needed by CreateTemplatePage */
  .ct-input { width: 100%; padding: 8px 10px; font-size: 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; background: #181818; color: white; outline: none; font-family: 'Manrope', sans-serif; box-sizing: border-box; transition: border-color .15s; }
  .ct-input:focus { border-color: #c8102e; }
  .ct-select { width: 100%; padding: 8px 10px; font-size: 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; background: #181818; color: white; outline: none; font-family: 'Manrope', sans-serif; cursor: pointer; }
  .ct-textarea { width: 100%; padding: 8px 10px; font-size: 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 7px; background: #181818; color: white; outline: none; font-family: monospace; resize: vertical; line-height: 1.55; min-height: 130px; box-sizing: border-box; }
  .ct-a4 { background: white; position: relative; font-family: 'Times New Roman', Times, serif; box-shadow: 0 6px 32px rgba(0,0,0,0.5); flex-shrink: 0; box-sizing: border-box; }
`;

// ── SVG ICONS ──
export const Icon = ({ name, size = 16 }) => {
  const icons = {
    grid:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    file:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    plus:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    users:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    settings:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    user:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    eye:          <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    edit:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    upload:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    download:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    warn:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    save:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
    mail:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    database:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
    check_circle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}>{icons[name] ?? null}</span>;
};

/* ═══════════════════════════════════════════════════════════
   ✅ NOTE: CreateTemplatePage is now imported from ./CreateTemplatePage
   All A4 page components (CoverPage, CertPage, TOCPage, KJHeader, A4Shell)
   live in CreateTemplatePage.jsx — no duplicates here.
   
   The CreateTemplatePage import expects these props:
     onSave(templateObj)  — called when admin clicks Save
     onCancel()           — called when admin clicks Cancel
   
   We adapt it below to work with setActivePage + addTemplate from store.
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   TEMPLATES PAGE
═══════════════════════════════════════════════════════════ */
const TemplatesPage = ({ setActivePage }) => {
  const [filter,    setFilter]   = useState('all');
  const [templates, setTmpls]    = useState(getTemplates);
  const refresh = () => setTmpls(getTemplates());

  const handleDelete = (id) => {
    if (!window.confirm('Delete this template?')) return;
    deleteTemplate(id); refresh();
  };

  const filtered = filter === 'all' ? templates : templates.filter(t => t.dept === filter.toUpperCase());

  return (
    <main className="a-content">
      <div className="a-page-top">
        <div>
          <h1 className="a-page-title">Manage Templates</h1>
          <p className="a-page-sub" style={{ marginBottom: 0 }}>Create and manage formatting templates</p>
        </div>
        <button className="a-add-btn" onClick={() => setActivePage('create')}>
          <Icon name="plus" size={14} /> Add Template
        </button>
      </div>
      <div className="a-filters">
        {['all', 'mca', 'bca'].map(f => (
          <button key={f} className={`a-filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="a-tmpl-stat"><span>Total Templates</span><strong>{filtered.length}</strong></div>
      {filtered.length === 0 ? (
        <div className="a-empty-state"><div>📂</div><p>No templates found. Create one to get started.</p></div>
      ) : (
        <div className="a-tmpl-grid">
          {filtered.map(t => (
            <div className="a-tmpl-card" key={t.id}>
              <div className="a-tmpl-card-top">
                <span className="a-tmpl-card-icon"><Icon name="file" size={22} /></span>
                <span className="a-active-badge">Active</span>
              </div>
              <h3>{t.name || t.subjectName}</h3>
              <div className="a-tmpl-card-dept">{t.dept} Department</div>
              <div className="a-tmpl-card-date">Updated: {t.updated || t.createdAt}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 14 }}>
                {t.courseCode && <span style={{ marginRight: 8 }}>{t.courseCode}</span>}
                {t.semester}
              </div>
              <div className="a-tmpl-card-actions">
                <button className="a-tmpl-action-btn"><Icon name="edit" size={13} /> Edit</button>
                <button className="a-tmpl-delete-btn" onClick={() => handleDelete(t.id)}>
                  <Icon name="trash" size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

/* ═══════════════════════════════════════════════════════════
   DASHBOARD HOME
═══════════════════════════════════════════════════════════ */
const AdminHome = ({ setActivePage }) => {
  const templates = getTemplates();
  const users     = getUsers();
  const docs      = getDocsFormatted();
  const stats = [
    { icon: 'users',    color: '#4ab8e8', num: users.length,     label: 'Total Students',      page: 'users' },
    { icon: 'file',     color: '#c8102e', num: templates.length, label: 'Total Templates',     page: 'templates' },
    { icon: 'download', color: '#2ecc71', num: docs,             label: 'Documents Formatted', page: null },
  ];
  return (
    <main className="a-content">
      <h1 className="a-page-title">Dashboard</h1>
      <p className="a-page-sub">Overview of your academic formatting platform</p>
      <div className="a-stat-grid">
        {stats.map((s, i) => (
          <div key={i} className="a-stat-card" onClick={() => s.page && setActivePage(s.page)} style={{ cursor: s.page ? 'pointer' : 'default' }}>
            <div className="a-stat-card-top"><span style={{ color: s.color }}><Icon name={s.icon} size={22} /></span></div>
            <div className="a-stat-num">{s.num}</div>
            <div className="a-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="a-activity-box">
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="a-add-btn" onClick={() => setActivePage('create')}><Icon name="plus" size={14} /> New Template</button>
          <button className="a-add-btn" style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }} onClick={() => setActivePage('users')}><Icon name="users" size={14} /> View Students</button>
          <button className="a-add-btn" style={{ background: 'var(--surface2)', border: '1px solid var(--border2)' }} onClick={() => setActivePage('templates')}><Icon name="file" size={14} /> Manage Templates</button>
        </div>
      </div>
    </main>
  );
};

/* ═══════════════════════════════════════════════════════════
   MANAGE USERS
═══════════════════════════════════════════════════════════ */
const ManageUsersPage = () => {
  const [filter, setFilter] = useState('all');
  const users = getUsers();
  const filtered = filter === 'all' ? users : users.filter(u => u.dept?.toLowerCase() === filter);
  return (
    <main className="a-content">
      <div className="a-page-top" style={{ marginBottom: 0 }}>
        <div><h1 className="a-page-title">Manage Users</h1><p className="a-page-sub" style={{ marginBottom: 0 }}>Students registered on the platform</p></div>
      </div>
      <div className="a-filters" style={{ marginTop: 20 }}>
        {['all', 'mca', 'bca'].map(f => (
          <button key={f} className={`a-filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="a-users-stats">
        <div className="a-users-stat"><span>Total Students</span><strong>{users.length}</strong></div>
        <div className="a-users-stat"><span>Active</span><strong className="green">{users.length}</strong></div>
        <div className="a-users-stat"><span>MCA</span><strong className="red">{users.filter(u => u.dept === 'MCA').length}</strong></div>
        <div className="a-users-stat"><span>BCA</span><strong className="gold">{users.filter(u => u.dept === 'BCA').length}</strong></div>
      </div>
      {filtered.length === 0 ? (
        <div className="a-empty-state"><div>👤</div><p>No students yet.</p></div>
      ) : (
        <div className="a-users-table-wrap">
          <table className="a-users-table">
            <thead><tr><th>Student Name</th><th>Department</th><th>Email</th></tr></thead>
            <tbody>
              {filtered.map((u, i) => {
                const initials = (u.name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <tr key={u.id ?? i}>
                    <td><div className="a-user-name-cell">
                      <div className="a-user-avatar" style={{ background: u.dept === 'MCA' ? 'var(--red)' : 'var(--gold)' }}>{initials}</div>
                      <span style={{ fontWeight: 700 }}>{u.name}</span>
                    </div></td>
                    <td><span className={`a-dept-badge ${u.dept?.toLowerCase()}`}>{u.dept}</span></td>
                    <td style={{ color: 'var(--text3)' }}>{u.email}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

/* ═══════════════════════════════════════════════════════════
   SETTINGS
═══════════════════════════════════════════════════════════ */
const SettingsPage = () => {
  const templates = getTemplates();
  const [maxSize,     setMaxSize]     = useState('50');
  const [defaultTmpl, setDefaultTmpl] = useState(String(templates[0]?.id ?? ''));
  const [allowDocx,   setAllowDocx]   = useState(true);
  const [allowDoc,    setAllowDoc]    = useState(true);
  const [saved,       setSaved]       = useState(false);
  const handleSave = () => {
    try { localStorage.setItem('kj_settings', JSON.stringify({ maxSize, defaultTmpl, allowDocx, allowDoc })); } catch {}
    setSaved(true); setTimeout(() => setSaved(false), 2000);
  };
  return (
    <main className="a-content">
      <h1 className="a-page-title">Platform Settings</h1>
      <p className="a-page-sub">Configure platform-wide settings</p>
      <div className="a-settings-wrap">
        <div className="a-settings-section">
          <div className="a-settings-section-title"><div className="a-settings-icon-wrap upload">📤</div>Upload Settings</div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'block' }}>Maximum File Size (MB)</label>
            <input className="ct-input" type="number" min="1" max="200" value={maxSize} onChange={e => setMaxSize(e.target.value)} style={{ maxWidth: 130 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, display: 'block' }}>Allowed File Types</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ label: '.docx', checked: allowDocx, onChange: setAllowDocx }, { label: '.doc', checked: allowDoc, onChange: setAllowDoc }].map(({ label, checked, onChange }) => (
                <label key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', border: '1px solid var(--border)', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                  <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />{label}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="a-settings-section">
          <div className="a-settings-section-title"><div className="a-settings-icon-wrap template">📋</div>Template Settings</div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 8, display: 'block' }}>Default Template</label>
            <select className="ct-select" value={defaultTmpl} onChange={e => setDefaultTmpl(e.target.value)} style={{ maxWidth: 320 }}>
              {templates.map(t => <option key={t.id} value={String(t.id)}>{t.name || t.subjectName}</option>)}
            </select>
            <p className="a-settings-note">Pre-selected for new students on the Choose Template page</p>
          </div>
        </div>
      </div>
      <button className="a-save-changes-btn" onClick={handleSave}>
        <Icon name="save" size={15} />{saved ? '✓ Saved!' : 'Save Changes'}
      </button>
    </main>
  );
};

/* ═══════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════ */
const AdminProfilePage = () => (
  <main className="a-content">
    <h1 className="a-page-title">Admin Profile</h1>
    <p className="a-page-sub">Manage your administrator account</p>
    <div className="a-profile-layout">
      <div className="a-profile-left">
        <div className="a-profile-avatar">AD</div>
        <h2>Administrator</h2>
        <div className="a-system-admin-badge">System Admin</div>
        <div className="a-profile-left-details">
          <div className="a-profile-detail"><span>Email</span><strong>admin@kju.com</strong></div>
          <div className="a-profile-detail"><span>Role</span><strong className="gold">System Administrator</strong></div>
        </div>
      </div>
      <div className="a-profile-right">
        <div className="a-profile-info-card">
          <h3>Administrator Information</h3>
          <div className="a-profile-info-grid">
            <div className="a-profile-info-field"><span><Icon name="user" size={12} /> Full Name</span><div className="field-val">Administrator</div></div>
            <div className="a-profile-info-field"><span><Icon name="mail" size={12} /> Email</span><div className="field-val">admin@kju.com</div></div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

/* ═══════════════════════════════════════════════════════════
   LOGOUT MODAL
═══════════════════════════════════════════════════════════ */
const LogoutModal = ({ onCancel, onConfirm }) => (
  <div className="a-modal-overlay" onClick={onCancel}>
    <div className="a-modal-box" onClick={e => e.stopPropagation()}>
      <button className="a-modal-close" onClick={onCancel}>✕</button>
      <div className="a-modal-warn-icon"><Icon name="warn" size={28} /></div>
      <h2>Logout?</h2>
      <p>Are you sure you want to logout? You'll need to sign in again to access the dashboard.</p>
      <div className="a-modal-buttons">
        <button className="a-modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="a-modal-confirm" onClick={onConfirm}><Icon name="logout" size={16} /> Logout</button>
      </div>
      <div className="a-modal-note">Your work is saved automatically</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   NAV
═══════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',       icon: 'grid'     },
  { id: 'templates', label: 'Templates',        icon: 'file'     },
  { id: 'create',    label: 'Create Template',  icon: 'plus'     },
  { id: 'users',     label: 'Manage Users',     icon: 'users'    },
  { id: 'settings',  label: 'Settings',         icon: 'settings' },
  { id: 'profile',   label: 'Profile',          icon: 'user'     },
];

/* ═══════════════════════════════════════════════════════════
   ROOT — AdminDashboard
═══════════════════════════════════════════════════════════ */
const AdminDashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [showLogout, setShowLogout] = useState(false);

  // ✅ Adapter: CreateTemplatePage expects onSave(obj) + onCancel()
  const handleTemplateSave = (templateObj) => {
    addTemplate({
      ...templateObj,
      name:    templateObj.subjectName,
      dept:    templateObj.semester?.includes('MCA') ? 'MCA' : 'BCA',
      font:    'Times New Roman',
      spacing: '1.5',
      updated: new Date().toISOString().slice(0, 10),
    });
    setActivePage('templates');
  };
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <AdminHome setActivePage={setActivePage} />;
      case 'templates': return <TemplatesPage setActivePage={setActivePage} />;
      case 'create': return (
  <CreateTemplatePage
    onSave={handleTemplateSave}
    onCancel={() => setActivePage('templates')}
  />
);
      case 'users':     return <ManageUsersPage />;
      case 'settings':  return <SettingsPage />;
      case 'profile':   return <AdminProfilePage />;
      default:          return <AdminHome setActivePage={setActivePage} />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="a-layout">
        <aside className="a-sidebar">
          <div className="a-sidebar-logo">
  <span className="a-logo-icon">F</span>
  <div className="a-logo-text-wrap"><div className="a-logo-name">FORMATIFY</div><div className="a-logo-sub">ADMIN PANEL</div></div>
</div>
<nav className="a-nav">
  {NAV_ITEMS.map(item => (
    <button key={item.id} className={`a-nav-item${activePage === item.id ? ' active' : ''}`} onClick={() => setActivePage(item.id)} title={item.label}>
      <span className="a-nav-icon"><Icon name={item.icon} size={16} /></span>
      <span className="a-nav-label">{item.label}</span>
    </button>
  ))}
  <button className="a-nav-item a-nav-logout" onClick={() => setShowLogout(true)} title="Logout">
    <span className="a-nav-icon"><Icon name="logout" size={16} /></span>
    <span className="a-nav-label">Logout</span>
  </button>
</nav>
        </aside>

        <div className="a-main">
          <header className="a-header">
            <div><h3>Welcome Admin</h3><p>Manage templates and student formatting activities</p></div>
            <div className="a-header-right">
              <div className="a-header-avatar"><Icon name="user" size={16} /></div>
              <span className="a-header-name">Admin</span>
            </div>
          </header>
          {/* ✅ overflow:hidden for create page so the A4 preview panel fills correctly */}
          <div style={{ flex: 1, overflow: activePage === 'create' ? 'hidden' : 'auto', display: 'flex', flexDirection: 'column' }}>
            {renderPage()}
          </div>
        </div>
      </div>

      {showLogout && (
  <LogoutModal onCancel={() => setShowLogout(false)} onConfirm={handleLogout} />
)}
    </>
  );
};

export default AdminDashboard;

