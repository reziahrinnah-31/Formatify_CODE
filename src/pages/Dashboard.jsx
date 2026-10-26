import { useState, useRef, useEffect, useCallback } from "react";
import { incrementTemplateDownloads, getTemplates } from '../utils/store';

// ── STYLES ──
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --red: #c8102e;
    --red-dark: #a40d24;
    --red-dim: rgba(200,16,46,0.12);
    --red-border: rgba(200,16,46,0.25);
    --gold: #c8a020;
    --gold-dim: rgba(200,160,32,0.12);
    --gold-border: rgba(200,160,32,0.25);
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #181818;
    --surface3: #1e1e1e;
    --border: rgba(255,255,255,0.06);
    --border2: rgba(255,255,255,0.1);
    --text: #ffffff;
    --text2: #ffffff;
    --text3: #e1dcdc;
    --text4: #b3b1b1;
  }

  body { font-family: 'Manrope', sans-serif; background: var(--bg); color: var(--text); }

  .layout { display: flex; min-height: 100vh; }

  /* ── Sidebar: icons-only by default, expands on hover ── */
  .sidebar {
    width: 60px;
    flex-shrink: 0;
    background: #0d0d0d;
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
    transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
    z-index: 100;
  }
  .sidebar:hover { width: 220px; }

  /* Force icons-only on fill + preview pages (no hover expand) */
  .sidebar.icons-only { width: 60px !important; pointer-events: none; }
  .sidebar.icons-only .nav-item { pointer-events: all; }
  .sidebar.icons-only .sidebar-logo { pointer-events: all; }

  .sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 20px 13px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    overflow: hidden; white-space: nowrap;
  }
  .logo-icon {
    width: 34px; height: 34px; border-radius: 8px;
    background: var(--red);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 900; color: white; flex-shrink: 0;
  }
  .logo-text {
    font-size: 14px; font-weight: 900; letter-spacing: 2px; color: white;
    opacity: 0; transition: opacity 0.2s ease 0.05s; white-space: nowrap;
  }
  .sidebar:not(.icons-only):hover .logo-text { opacity: 1; }

  .nav { display: flex; flex-direction: column; padding: 14px 8px; gap: 2px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 11px 11px; border-radius: 10px;
    background: transparent; border: none;
    color: var(--text3); font-size: 13.5px; font-weight: 600;
    font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: all 0.2s; text-align: left;
    width: 100%; overflow: hidden; white-space: nowrap;
  }
  .nav-item:hover { background: rgba(255,255,255,0.04); color: #bbb; }
  .nav-item.active { background: var(--red) !important; color: white !important; }
  .nav-icon { font-size: 16px; width: 18px; text-align: center; flex-shrink: 0; }
  .nav-label {
    opacity: 0; transition: opacity 0.2s ease 0.05s;
    white-space: nowrap; overflow: hidden;
  }
  .sidebar:not(.icons-only):hover .nav-label { opacity: 1; }
  .nav-logout { margin-top: auto; }
  .nav-logout:hover { color: var(--red); background: var(--red-dim) !important; }

  .main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }

  .header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 36px;
    border-bottom: 1px solid var(--border);
    background: #0d0d0d;
    position: sticky; top: 0; z-index: 20;
  }
  .header h3 { font-size: 15px; font-weight: 700; color: white; margin-bottom: 2px; }
  .header p { font-size: 12px; color: var(--text3); }
  .header-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--red-dim); border: 1px solid var(--red-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; color: var(--red);
    cursor: pointer; transition: all 0.2s;
  }
  .header-avatar:hover { background: rgba(200,16,46,0.2); }

  .content { padding: 36px; flex: 1; }
  .page-title { font-size: 32px; font-weight: 900; margin-bottom: 6px; }
  .page-sub { color: var(--text3); font-size: 14px; margin-bottom: 32px; }

  .cards-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; }
  .dash-card {
    border-radius: 16px; padding: 28px 24px;
    border: 1px solid var(--border); cursor: default;
    transition: all 0.3s ease;
  }
  .dash-card:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
  .dash-card.red-card { background: rgba(200,16,46,0.07); border-color: rgba(200,16,46,0.18); }
  .dash-card.gold-card { background: rgba(200,160,32,0.07); border-color: rgba(200,160,32,0.18); }
  .card-icon {
    font-size: 22px; width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
  }
  .card-icon.red { background: var(--red-dim); color: var(--red); }
  .card-icon.gold { background: var(--gold-dim); color: var(--gold); }
  .dash-card h2 { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
  .dash-card p { font-size: 13px; color: var(--text3); margin-bottom: 18px; }
  .card-link {
    background: none; border: none; font-size: 13px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; padding: 0; transition: opacity 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .card-link:hover { opacity: 0.7; }
  .card-link.red { color: var(--red); }
  .card-link.gold { color: var(--gold); }

  .templates-box {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px; max-width: 500px;
  }
  .templates-box h3 { font-size: 16px; font-weight: 800; margin-bottom: 18px; }
  .tmpl-item {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px; margin-bottom: 10px;
    cursor: pointer; transition: all 0.2s;
  }
  .tmpl-item:hover { border-color: var(--red-border); background: var(--red-dim); }
  .tmpl-item:last-child { margin-bottom: 0; }
  .tmpl-item h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .tmpl-item p { font-size: 12px; color: var(--text3); }

  .upload-zone {
    background: var(--surface); border: 2px dashed rgba(255,255,255,0.1);
    border-radius: 20px; padding: 56px 40px; text-align: center;
    cursor: pointer; transition: all 0.3s; margin-bottom: 20px;
  }
  .upload-zone:hover { border-color: rgba(200,16,46,0.5); background: rgba(200,16,46,0.03); }
  .upload-zone.drag { border-color: var(--red); background: rgba(200,16,46,0.07); transform: scale(1.01); }
  .upload-zone.success { border-color: #28c840; border-style: solid; background: rgba(40,200,64,0.04); }
  .upload-circle {
    width: 76px; height: 76px; background: var(--red-dim); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; color: var(--red); margin: 0 auto 20px;
  }
  .upload-zone h2 { font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .upload-zone > p { font-size: 14px; color: var(--text3); margin-bottom: 24px; }
  .browse-btn {
    background: var(--red); border: none; color: white;
    padding: 13px 32px; border-radius: 10px; font-size: 14px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s; margin-bottom: 36px;
  }
  .browse-btn:hover { background: var(--red-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,16,46,0.4); }
  .upload-meta {
    display: flex; justify-content: center; gap: 60px;
    padding-top: 24px; border-top: 1px solid var(--border);
  }
  .meta-item { text-align: center; }
  .meta-item span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 5px; }
  .meta-item strong { font-size: 15px; font-weight: 800; color: var(--red); }
  .upload-instructions {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 24px 28px;
  }
  .upload-instructions h3 { font-size: 16px; font-weight: 800; margin-bottom: 16px; }
  .upload-instructions ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .upload-instructions li { font-size: 13px; color: var(--text2); }

  .template-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 28px; }
  .template-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; cursor: pointer;
    transition: all 0.3s; position: relative;
  }
  .template-card:hover { border-color: rgba(200,16,46,0.35); transform: translateY(-3px); box-shadow: 0 12px 36px rgba(0,0,0,0.3); }
  .template-card.selected { border-color: var(--red); background: rgba(200,16,46,0.05); }
  .tc-icon-wrap {
    width: 60px; height: 60px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; margin-bottom: 20px;
  }
  .tc-icon-wrap.red { background: var(--red-dim); }
  .tc-icon-wrap.gold { background: var(--gold-dim); }
  .template-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .template-card > p { font-size: 13px; color: var(--text3); margin-bottom: 20px; }
  .tc-specs { border-top: 1px solid var(--border); padding-top: 16px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .tc-spec-row { display: flex; justify-content: space-between; font-size: 13px; }
  .tc-spec-row span { color: var(--text3); }
  .tc-spec-row strong { color: var(--text); font-weight: 700; }
  .tc-check {
    position: absolute; top: 14px; right: 14px;
    width: 24px; height: 24px; border-radius: 50%;
    background: var(--red); display: flex; align-items: center; justify-content: center;
    font-size: 12px; opacity: 0; transition: opacity 0.2s;
  }
  .tc-check.visible { opacity: 1; }
  .tc-actions {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 16px; border-top: 1px solid var(--border);
  }
  .tc-preview-btn {
    display: flex; align-items: center; gap: 6px;
    background: none; border: none; color: var(--text2); font-size: 13px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; transition: color 0.2s;
  }
  .tc-preview-btn:hover { color: white; }
  .tc-use-btn {
    background: var(--red); border: none; color: white;
    padding: 10px 20px; border-radius: 8px;
    font-size: 13px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .tc-use-btn.gold-btn { background: var(--gold); color: #111; }
  .tc-use-btn:hover { opacity: 0.85; transform: translateY(-1px); }

  .fill-status {
    padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600;
  }
  .fill-status.ok  { background: rgba(40,200,64,0.1); border: 1px solid rgba(40,200,64,0.3); color: #4caf82; }
  .fill-status.err { background: rgba(200,16,46,0.1); border: 1px solid rgba(200,16,46,0.3); color: #ff6b6b; }

  .a4-grey-wrap {
    background: #0d1117; border-radius: 10px; padding: 16px;
    max-height: 80vh; overflow-y: auto;
  }
  .a4-grey-wrap.red-border {
    border: 2px solid var(--red);
    box-shadow: 0 0 0 2px var(--red), 0 8px 32px rgba(200,16,46,0.2);
  }

  .doc-viewer-spinner {
    width: 32px; height: 32px; border: 3px solid #333;
    border-top-color: var(--red); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .joined-badge {
    display: inline-flex; align-items: center; gap: 5px;
    background: rgba(200,16,46,0.1); border: 1px solid rgba(200,16,46,0.3);
    color: var(--red); border-radius: 20px; padding: 4px 12px;
    font-size: 11px; font-weight: 700; font-family: 'Manrope', sans-serif;
  }

  .preview-details {
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 24px;
  }
  .preview-details h3 { font-size: 16px; font-weight: 800; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .preview-details-icon { font-size: 18px; color: var(--red); }
  .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 24px; }
  .detail-item span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 4px; }
  .detail-item strong { font-size: 14px; font-weight: 700; }
  .preview-actions { display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border); }
  .back-btn {
    background: none; border: none; color: var(--text3); font-size: 13px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 6px;
    transition: color 0.2s;
  }
  .back-btn:hover { color: white; }
  .proceed-btn {
    background: var(--red); border: none; color: white;
    padding: 13px 28px; border-radius: 10px; font-size: 14px; font-weight: 700;
    font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s;
    display: flex; align-items: center; gap: 8px;
  }
  .proceed-btn:hover { background: var(--red-dark); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,16,46,0.4); }
  .preview-empty {
    text-align: center; padding: 80px;
    background: var(--surface); border: 1px solid var(--border); border-radius: 16px;
  }
  .preview-empty-icon { font-size: 48px; margin-bottom: 16px; }
  .preview-empty h3 { font-size: 20px; font-weight: 800; margin-bottom: 10px; }
  .preview-empty p { color: var(--text3); font-size: 14px; }

  .dl-creative-wrap { max-width: 680px; margin: 0 auto; }
  .dl-hero {
    background: linear-gradient(135deg, rgba(200,16,46,0.12) 0%, rgba(200,16,46,0.04) 60%, rgba(0,0,0,0) 100%);
    border: 1px solid rgba(200,16,46,0.2);
    border-radius: 24px; padding: 48px 40px 36px;
    text-align: center; margin-bottom: 20px; position: relative; overflow: hidden;
  }
  .dl-file-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(200,16,46,0.1); border: 1px solid rgba(200,16,46,0.25);
    color: var(--red); border-radius: 30px; padding: 6px 16px;
    font-size: 12px; font-weight: 700; margin-bottom: 20px;
  }
  .dl-filename { font-size: 20px; font-weight: 900; margin-bottom: 8px; word-break: break-all; }
  .dl-meta-row {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; margin-bottom: 32px; flex-wrap: wrap;
  }
  .dl-meta-chip {
    display: flex; align-items: center; gap: 6px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 8px; padding: 6px 14px; font-size: 12px; color: var(--text2);
  }
  .dl-meta-chip strong { color: white; font-weight: 700; }
  .dl-action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
  .dl-action-card {
    border-radius: 16px; padding: 22px 20px;
    cursor: pointer; border: none; font-family: 'Manrope', sans-serif;
    transition: all 0.25s; text-align: left; display: flex; flex-direction: column; gap: 8px;
  }
  .dl-action-card.docx {
    background: linear-gradient(135deg, rgba(200,16,46,0.15), rgba(200,16,46,0.06));
    border: 1px solid rgba(200,16,46,0.3);
  }
  .dl-action-card.docx:hover { background: linear-gradient(135deg, rgba(200,16,46,0.25), rgba(200,16,46,0.1)); transform: translateY(-3px); box-shadow: 0 10px 32px rgba(200,16,46,0.3); }
  .dl-action-card.pdf {
    background: linear-gradient(135deg, rgba(200,160,32,0.15), rgba(200,160,32,0.06));
    border: 1px solid rgba(200,160,32,0.3);
  }
  .dl-action-card.pdf:hover { background: linear-gradient(135deg, rgba(200,160,32,0.25), rgba(200,160,32,0.1)); transform: translateY(-3px); box-shadow: 0 10px 32px rgba(200,160,32,0.2); }
  .dl-card-icon { font-size: 28px; }
  .dl-card-title { font-size: 16px; font-weight: 800; }
  .dl-card-title.red { color: var(--red); }
  .dl-card-title.gold { color: var(--gold); }
  .dl-card-desc { font-size: 12px; color: var(--text3); line-height: 1.5; }
  .dl-card-ext { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 800; margin-top: 4px; }
  .dl-card-ext.red { background: rgba(200,16,46,0.15); color: var(--red); }
  .dl-card-ext.gold { background: rgba(200,160,32,0.15); color: var(--gold); }
  .dl-return-btn {
    background: none; border: none; color: var(--text3); font-size: 13px; font-weight: 600;
    font-family: 'Manrope', sans-serif; cursor: pointer; display: flex; align-items: center;
    gap: 6px; transition: color 0.2s; margin: 0 auto;
  }
  .dl-return-btn:hover { color: white; }
  .dl-steps { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 20px 24px; }
  .dl-steps h4 { font-size: 13px; font-weight: 800; color: var(--text2); margin-bottom: 14px; }
  .dl-step-row { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .dl-step-row:last-child { border-bottom: none; padding-bottom: 0; }
  .dl-step-num {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: var(--red-dim); border: 1px solid var(--red-border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 800; color: var(--red);
  }
  .dl-step-text { font-size: 13px; color: var(--text2); line-height: 1.5; }
  .dl-step-text strong { color: white; }

  .history-filters { display: flex; gap: 8px; margin-bottom: 24px; }
  .filter-btn {
    background: var(--surface); border: 1px solid var(--border);
    color: var(--text3); padding: 8px 20px; border-radius: 20px;
    font-size: 13px; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: all 0.2s;
  }
  .filter-btn:hover { border-color: var(--border2); color: white; }
  .filter-btn.active { background: var(--red); border-color: var(--red); color: white; }
  .history-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; }
  .stat-card span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 8px; }
  .stat-card strong { font-size: 28px; font-weight: 900; }
  .stat-card strong.red { color: var(--red); }
  .stat-card strong.gold { color: var(--gold); }
  .history-list { display: flex; flex-direction: column; gap: 12px; }
  .history-item {
    display: flex; align-items: center; gap: 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 22px; transition: all 0.2s;
  }
  .history-item:hover { border-color: rgba(200,16,46,0.25); transform: translateX(3px); }
  .history-icon { font-size: 26px; color: var(--red); }
  .history-info { flex: 1; }
  .history-info h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .history-info p { font-size: 12px; color: var(--text3); }
  .hist-dl-btn {
    background: var(--red-dim); border: 1px solid var(--red-border);
    color: var(--red); padding: 9px 18px; border-radius: 8px;
    font-size: 12px; font-weight: 700; font-family: 'Manrope', sans-serif;
    cursor: pointer; transition: all 0.2s; white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }
  .hist-dl-btn:hover { background: var(--red); color: white; }

  .profile-layout { display: grid; grid-template-columns: 260px 1fr; gap: 20px; }
  .profile-left-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 36px 28px; text-align: center; }
  .profile-avatar-ring {
    width: 80px; height: 80px; border-radius: 50%;
    background: linear-gradient(135deg, #ff6b35, #c8102e);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 900; color: white; margin: 0 auto 18px;
  }
  .profile-left-card h2 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
  .profile-dept { font-size: 13px; color: var(--text3); margin-bottom: 28px; }
  .profile-left-details { text-align: left; border-top: 1px solid var(--border); padding-top: 20px; display: flex; flex-direction: column; gap: 14px; }
  .pld-item span { display: block; font-size: 11px; color: var(--text4); margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.5px; }
  .pld-item strong { font-size: 13px; font-weight: 700; }
  .profile-right { display: flex; flex-direction: column; gap: 16px; }
  .profile-info-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; }
  .profile-info-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 22px; display: flex; justify-content: space-between; align-items: center; }
  .edit-btn { background: none; border: none; color: var(--text3); font-size: 13px; font-weight: 600; font-family: 'Manrope', sans-serif; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: color 0.2s; }
  .edit-btn:hover { color: white; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .info-field span { display: block; font-size: 12px; color: var(--text3); margin-bottom: 6px; font-weight: 600; }
  .info-field .field-val { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-size: 13px; color: var(--text2); }
  .danger-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 24px 28px; }
  .danger-card h3 { font-size: 14px; font-weight: 800; color: var(--red); margin-bottom: 16px; }
  .danger-row { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
  .danger-row div h4 { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
  .danger-row div p { font-size: 12px; color: var(--text3); }
  .delete-btn { background: var(--red); border: none; color: white; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
  .delete-btn:hover { background: var(--red-dark); }

  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000;
    display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: #141414; border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px; padding: 44px 44px 36px; width: 420px; text-align: center;
    position: relative; animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text3); font-size: 18px; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
  .modal-close:hover { background: rgba(255,255,255,0.06); color: white; }
  .modal-warn-icon { width: 72px; height: 72px; border-radius: 50%; background: var(--red-dim); border: 1px solid var(--red-border); display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 22px; color: var(--red); }
  .modal-box h2 { font-size: 24px; font-weight: 900; margin-bottom: 12px; }
  .modal-box p { font-size: 14px; color: var(--text3); line-height: 1.6; margin-bottom: 28px; }
  .modal-buttons { display: flex; gap: 12px; justify-content: center; margin-bottom: 16px; }
  .modal-cancel { background: none; border: 1px solid var(--border2); color: white; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.2s; flex: 1; }
  .modal-cancel:hover { background: rgba(255,255,255,0.05); }
  .modal-confirm { background: var(--red); border: none; color: white; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; font-family: 'Manrope', sans-serif; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center; }
  .modal-confirm:hover { background: var(--red-dark); }
  .modal-note { font-size: 12px; color: var(--text4); }

  @media (max-width: 900px) {
    .cards-row, .template-grid, .details-grid, .dl-action-grid,
    .history-stats, .profile-layout, .info-grid { grid-template-columns: 1fr; }
    .content { padding: 20px; }
    .header { padding: 14px 20px; }
  }
`;

// ── SVG ICONS ──
const Icon = ({ name, size = 16, style }) => {
  const icons = {
    grid:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    upload:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    file:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    eye:         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    download:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    clock:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    user:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    logout:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    edit:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    warn:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    arrow_right: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    arrow_left:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
    check:       <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
    home:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    circle_check:<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    layers:      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  };
  return <span style={style}>{icons[name]}</span>;
};

// ── STORAGE KEY for form data ──
const FORM_DATA_KEY = 'kj_templateFormData';

// ── helpers: persist form data to sessionStorage ──
function saveFormData(data) {
  try { sessionStorage.setItem(FORM_DATA_KEY, JSON.stringify(data)); } catch (_) {}
}
function loadFormData() {
  try { return JSON.parse(sessionStorage.getItem(FORM_DATA_KEY) || 'null'); } catch (_) { return null; }
}

// ── helper: send uploaded file buffer to an iframe ──
function sendFileToIframe(file, iframe) {
  const reader = new FileReader();
  reader.onload = (e) => {
    setTimeout(() => {
      try {
        iframe.contentWindow.postMessage(
          { type: 'DOCX_FILE', buffer: e.target.result, filename: file.name }, '*'
        );
      } catch (_) {}
    }, 300);
  };
  reader.readAsArrayBuffer(file);
}

// ── helper: push saved form data into an iframe ──
function restoreFormInIframe(iframe, savedData, delay = 700) {
  // Accept explicit data or fall back to sessionStorage
  const data = (savedData && Object.keys(savedData).length > 0) ? savedData : loadFormData();
  if (!data) return;
  setTimeout(() => {
    try {
      iframe.contentWindow.postMessage({ type: 'RESTORE_FORM', data }, '*');
    } catch (_) {}
  }, delay);
}

// ─────────────────────────────────────────────────────────────
// CombinedPreviewIframe
// Shows the filled-in template in preview / download pages.
// Accepts `savedFormData` so the parent's latest state is used.
// ─────────────────────────────────────────────────────────────
const CombinedPreviewIframe = ({ file, savedFormData }) => {
  const iframeRef    = useRef(null);
  const initializedRef = useRef(false);          // ← guard: only init once
  const [loaded,  setLoaded]  = useState(false);
  const [sending, setSending] = useState(false);
  const [iframeH, setIframeH] = useState(1200);

  const initIframe = useCallback((iframe, f, formData) => {
    if (!iframe || initializedRef.current) return;   // ← skip if already done
    initializedRef.current = true;
    setSending(true);

    try {
      const style = iframe.contentDocument.createElement('style');
      style.textContent = `
        .form-panel { display: none !important; }
        body { overflow-x: hidden; margin: 0; background: #0d1117 !important; }
        .preview-panel {
          padding: 16px !important; background: #0d1117 !important;
          align-items: center !important; width: 100% !important;
        }
        .preview-panel h4 { display: none !important; }
        #previewArea { width: 100% !important; display: flex; flex-direction: column; align-items: center; }
        .a4-page, .a4-doc-page {
          width: 210mm !important; margin: 0 auto 16px !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.35) !important;
        }
        .preview-section-title { width: 210mm; margin: 8px auto; }
      `;
      iframe.contentDocument.head.appendChild(style);
    } catch (_) {}

    restoreFormInIframe(iframe, formData, 300);

    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          try {
            iframe.contentWindow.postMessage(
              { type: 'DOCX_FILE', buffer: e.target.result, filename: f.name }, '*'
            );
          } catch (_) {}
          setSending(false);
        }, 500);
      };
      reader.readAsArrayBuffer(f);
    } else {
      setSending(false);
    }
  }, []);  // ← no deps; refs are stable

  const handleLoad = useCallback(() => {
    setLoaded(true);
    initIframe(iframeRef.current, file, savedFormData);
  }, [file, savedFormData, initIframe]);

  // Height polling — only run after fully initialized
  useEffect(() => {
    if (!loaded || sending) return;
    const timer = setInterval(() => {
      try {
        const h = iframeRef.current?.contentDocument?.body?.scrollHeight;
        if (h && h > 400 && Math.abs(h - iframeH) > 20) setIframeH(h + 40);
      } catch (_) {}
    }, 2000);                       // ← slower poll reduces flicker
    return () => clearInterval(timer);
  }, [loaded, sending, iframeH]);

  return (
    <div style={{ position: 'relative', minHeight: 400 }}>
      {(!loaded || sending) && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5, background: '#0d1117',
          minHeight: 300, borderRadius: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 10,
        }}>
          <div className="doc-viewer-spinner" />
          <span style={{ color: '#ddd', fontSize: 13 }}>
            {!loaded ? 'Loading preview…' : 'Rendering document…'}
          </span>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src="/template.html"
        title="Formatted Document Preview"
        onLoad={handleLoad}
        style={{
          width: '100%', height: iframeH, border: 'none',
          display: 'block', background: '#0d1117',
        }}
      />
    </div>
  );
};
// ── PAGE: DASHBOARD HOME ──
const DashboardHome = ({ setActivePage }) => (
  <main className="content">
    <h1 className="page-title">Dashboard</h1>
    <p className="page-sub">Manage your academic documents efficiently.</p>
    <div className="cards-row">
      <div className="dash-card red-card">
        <div className="card-icon red"><Icon name="upload" size={22} /></div>
        <h2>Upload New Document</h2>
        <p>Start formatting your academic report</p>
        <button className="card-link red" onClick={() => setActivePage('upload')}>
          Get Started <Icon name="arrow_right" size={13} />
        </button>
      </div>
      <div className="dash-card gold-card">
        <div className="card-icon gold"><Icon name="file" size={22} /></div>
        <h2>Select Template</h2>
        <p>Choose MCA or BCA project format</p>
        <button className="card-link gold" onClick={() => setActivePage('template')}>
          Browse Templates <Icon name="arrow_right" size={13} />
        </button>
      </div>
    </div>
    <div className="templates-box">
      <h3>Templates</h3>
      {[
        { id: 'mca', name: 'MCA Template', desc: 'Times New Roman • A4 • 1.5 Spacing' },
        { id: 'bca', name: 'BCA Template', desc: 'Times New Roman • A4 • 1.5 Spacing' },
      ].map(t => (
        <div className="tmpl-item" key={t.id} onClick={() => setActivePage('template')}>
          <div><h4>{t.name}</h4><p>{t.desc}</p></div>
          <Icon name="file" size={20} style={{ color: 'var(--red)' }} />
        </div>
      ))}
    </div>
  </main>
);

// ── PAGE: UPLOAD ──
const UploadPage = ({ onFileUpload, uploadedFile, setActivePage }) => {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.docx')) { alert('Only .docx files are supported!'); return; }
    if (file.size > 50 * 1024 * 1024) { alert('File size must be under 50MB!'); return; }
    onFileUpload(file);
  };

  return (
    <main className="content">
      <h1 className="page-title">Upload Document</h1>
      <p className="page-sub">Upload your Word document to begin formatting</p>
      <div
        className={`upload-zone${dragging ? ' drag' : ''}${uploadedFile ? ' success' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => !uploadedFile && fileInputRef.current.click()}
      >
        <input ref={fileInputRef} type="file" accept=".docx" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
        {uploadedFile ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: '#28c840' }}>{uploadedFile.name}</h2>
            <p style={{ color: 'var(--text2)', marginBottom: 28 }}>{(uploadedFile.size / 1024).toFixed(1)} KB — Ready to format</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
              <button className="browse-btn" style={{ background: 'var(--surface2)', border: '1px solid var(--border2)', marginBottom: 0 }} onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}>Change File</button>
              <button className="browse-btn" style={{ marginBottom: 0 }} onClick={e => { e.stopPropagation(); setActivePage('template'); }}>Choose Template →</button>
            </div>
          </>
        ) : (
          <>
            <div className="upload-circle"><Icon name="upload" size={28} /></div>
            <h2>Drag and Drop DOCX File</h2>
            <p>or click to browse from your computer</p>
            <button className="browse-btn" onClick={e => { e.stopPropagation(); fileInputRef.current.click(); }}>Browse Files</button>
          </>
        )}
        <div className="upload-meta">
          <div className="meta-item"><span>Supported Format</span><strong>DOCX</strong></div>
          <div className="meta-item"><span>Maximum File Size</span><strong>50 MB</strong></div>
        </div>
      </div>
      <div className="upload-instructions">
        <h3>Upload Instructions</h3>
        <ul>
          <li>✅ Only Microsoft Word (.docx) files are supported</li>
          <li>✅ Maximum file size is 50 MB</li>
          <li>✅ After uploading, click <strong style={{color:'var(--red)'}}>Choose Template</strong> to continue</li>
          <li>✅ Headers, footers, and page numbers will be automatically applied</li>
        </ul>
      </div>
    </main>
  );
};

// ── PAGE: TEMPLATE (dynamic — reads admin-created templates from store) ──
const TemplatePage = ({ selectedTemplate, onSelectTemplate, setActivePage, onSelectTemplateObj }) => {
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const myProgram = (stored.program || '').toUpperCase(); // e.g. "MCA" or "BCA"

  const allTemplates = getTemplates();

  // Only show templates matching the student's own program (by semester string,
  // e.g. semester: "II Semester MCA" matches program "MCA").
  const myTemplates = allTemplates.filter(t =>
    !myProgram || (t.semester || '').toUpperCase().includes(myProgram)
  );

  const colorFor = (t) => (t.dept === 'BCA' ? 'gold' : 'red');

  return (
    <main className="content">
      <h1 className="page-title">Choose Template</h1>
      <p className="page-sub">Select the formatting template your teacher created for {myProgram || 'your program'}</p>

      {myTemplates.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 60, background: 'var(--surface)',
          borderRadius: 16, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📂</div>
          <h3 style={{ marginBottom: 8 }}>No templates available yet</h3>
          <p style={{ color: 'var(--text3)', fontSize: 14 }}>
            Your teacher hasn't published a template for {myProgram || 'your program'} yet. Check back later.
          </p>
        </div>
      ) : (
        <div className="template-grid">
          {myTemplates.map(t => {
            const color = colorFor(t);
            const isSelected = selectedTemplate === String(t.id);
            return (
              <div
                key={t.id}
                className={`template-card${isSelected ? ' selected' : ''}`}
                onClick={() => { onSelectTemplate(String(t.id)); onSelectTemplateObj && onSelectTemplateObj(t); }}
              >
                <div className={`tc-icon-wrap ${color}`}>
                  <Icon name="file" size={28} style={{ color: color === 'red' ? 'var(--red)' : 'var(--gold)' }} />
                </div>
                <h3>{t.subjectName || t.name}</h3>
                <p>{t.courseCode} · {t.semester}</p>
                <div className="tc-specs">
                  <div className="tc-spec-row"><span>Course Code</span><strong>{t.courseCode}</strong></div>
                  <div className="tc-spec-row"><span>Semester</span><strong>{t.semester}</strong></div>
                  <div className="tc-spec-row"><span>Academic Year</span><strong>{t.academicYear}</strong></div>
                  <div className="tc-spec-row"><span>Font</span><strong>{t.font || 'Times New Roman'}</strong></div>
                </div>
                <div className="tc-actions">
                  <button
                    className="tc-preview-btn"
                    onClick={e => { e.stopPropagation(); onSelectTemplate(String(t.id)); onSelectTemplateObj && onSelectTemplateObj(t); setActivePage('preview'); }}
                  >
                    <Icon name="eye" size={14}/> Preview
                  </button>
                  <button
                    className={`tc-use-btn${color === 'gold' ? ' gold-btn' : ''}`}
                    onClick={e => {
                      e.stopPropagation();
                      onSelectTemplate(String(t.id));
                      onSelectTemplateObj && onSelectTemplateObj(t);
                      setActivePage('filltemplate');
                    }}
                  >
                    Use Template <Icon name="arrow_right" size={14}/>
                  </button>
                </div>
                <div className={`tc-check${isSelected ? ' visible' : ''}`}><Icon name="check" size={12}/></div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: FILL TEMPLATE
// The iframe posts TEMPLATE_DATA whenever a field changes.
// "Save & Preview" explicitly requests the latest snapshot
// before navigating.
// ─────────────────────────────────────────────────────────────
const FillTemplatePage = ({ setActivePage, uploadedFile, onTemplateDataChange, savedFormData, selectedTemplateObj }) => {
  const iframeRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState('');

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const existing = (savedFormData && Object.keys(savedFormData).length > 0)
      ? savedFormData
      : loadFormData();

    // A template was selected and it's a DIFFERENT template than whatever
    // saved data belongs to (or there's no saved data at all) → always load it.
    const sameTemplate = existing && selectedTemplateObj &&
      String(existing.templateId) === String(selectedTemplateObj.id);

    if (selectedTemplateObj && !sameTemplate) {
      setTimeout(() => {
        try {
          iframe.contentWindow.postMessage({ type: 'LOAD_TEMPLATE', template: selectedTemplateObj }, '*');
        } catch (_) {}
      }, 300);
    }

    if (uploadedFile) sendFileToIframe(uploadedFile, iframe);

    // Only restore student-authored values (name/regNo/TOC) if they belong
    // to THIS template — never restore a stale different template's data.
    if (sameTemplate) {
      setTimeout(() => {
        try {
          iframe.contentWindow.postMessage({ type: 'RESTORE_FORM', data: existing }, '*');
        } catch (_) {}
      }, 700);
    }
  };

  // If the file changes after mount, push it to the iframe
  useEffect(() => {
    if (uploadedFile && iframeRef.current) sendFileToIframe(uploadedFile, iframeRef.current);
  }, [uploadedFile]);

  // Listen for live form data updates from the iframe
  useEffect(() => {
    const handler = (e) => {
      if (e.data && e.data.type === 'TEMPLATE_DATA') {
        onTemplateDataChange && onTemplateDataChange(e.data.payload);
        saveFormData(e.data.payload);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onTemplateDataChange]);

  // "Save & Preview": ask the iframe for the very latest values, then navigate
  const handleSaveAndPreview = () => {
    setSaveStatus('saving');
    const iframe = iframeRef.current;

    try {
      iframe?.contentWindow.postMessage({ type: 'REQUEST_FORM_DATA' }, '*');
    } catch (_) {}

    const handler = (e) => {
      if (e.data && e.data.type === 'TEMPLATE_DATA') {
        window.removeEventListener('message', handler);
        onTemplateDataChange(e.data.payload);
        saveFormData(e.data.payload);
        setSaveStatus('saved');
        setTimeout(() => setActivePage('preview'), 400);
      }
    };
    window.addEventListener('message', handler);

    // Fallback: navigate anyway after 1 s using whatever was last saved
    setTimeout(() => {
      window.removeEventListener('message', handler);
      setSaveStatus('');
      setActivePage('preview');
    }, 1000);
  };

  return (
    <main style={{ padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', background: '#0d0d0d',
        borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, color: '#666' }}>Fill in details — edits are saved when you click Preview</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus === 'saving' && <span style={{ fontSize: 12, color: 'var(--text3)' }}>Saving…</span>}
          {saveStatus === 'saved'  && <span style={{ fontSize: 12, color: '#28c840' }}>✓ Saved</span>}
          <button
            style={{
              background: 'var(--red)', border: 'none', color: 'white',
              padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
            onClick={handleSaveAndPreview}
          >
            Save &amp; Preview <Icon name="arrow_right" size={14} />
          </button>
        </div>
      </div>

      {/* Full-height template iframe */}
      <iframe
        ref={iframeRef}
        src="/template.html"
        style={{ width: '100%', flex: 1, border: 'none', display: 'block', minHeight: 'calc(100vh - 57px)' }}
        title="MCA Template Generator"
        onLoad={handleIframeLoad}
      />
    </main>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: PREVIEW
// Uses CombinedPreviewIframe which accepts savedFormData and
// applies RESTORE_FORM before sending the DOCX file.
// ─────────────────────────────────────────────────────────────
const PreviewPage = ({ uploadedFile, selectedTemplate, templateData, savedFormData, setActivePage }) => {
  if (!uploadedFile || !selectedTemplate) return (
    <main className="content">
      <h1 className="page-title">Preview Formatted Report</h1>
      <p className="page-sub">Review your document before downloading</p>
      <div className="preview-empty">
        <div className="preview-empty-icon"><Icon name="eye" size={48}/></div>
        <h3>No Document to Preview</h3>
        <p>Please upload a document and select a template first.</p>
      </div>
    </main>
  );

  // Prefer live prop, fall back to sessionStorage
  const displayData = (templateData && Object.keys(templateData).length > 0)
    ? templateData
    : (loadFormData() || {});

  return (
    <main className="content" style={{ padding: '20px 20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 4 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Preview Formatted Report</h1>
        <div style={{ display:'flex', gap: 10 }}>
          <button className="back-btn" onClick={() => setActivePage('filltemplate')}>
            <Icon name="arrow_left" size={14}/> Edit Template
          </button>
          <button className="proceed-btn" onClick={() => setActivePage('download')} style={{ padding: '10px 20px', fontSize: 13 }}>
            Proceed to Download <Icon name="arrow_right" size={14}/>
          </button>
        </div>
      </div>
      <p className="page-sub">This is exactly how your formatted document will look</p>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 10 }}>
          <span style={{ color:'var(--red)', fontSize:13, fontWeight:700 }}>Formatted Document Preview</span>
          <span className="joined-badge"><Icon name="layers" size={11}/> Cover + TOC + Document</span>
        </div>
        {/* Pass savedFormData so the iframe knows which values to restore */}
        <div className="a4-grey-wrap red-border">
          <CombinedPreviewIframe file={uploadedFile} savedFormData={savedFormData || displayData} />
        </div>
      </div>

      <div className="preview-details">
        <h3>Template Details <span className="preview-details-icon"><Icon name="file" size={18}/></span></h3>
        <div className="details-grid">
          <div className="detail-item"><span>Template</span><strong>{selectedTemplate==='mca'?'MCA Project Template':'BCA Project Template'}</strong></div>
          <div className="detail-item"><span>Font</span><strong>Times New Roman</strong></div>
          <div className="detail-item"><span>Margin</span><strong>1 inch all sides</strong></div>
          <div className="detail-item"><span>Spacing</span><strong>1.5 Line Spacing</strong></div>
          {displayData?.subjectName && <div className="detail-item"><span>Subject</span><strong>{displayData.subjectName}</strong></div>}
          {displayData?.studentName && <div className="detail-item"><span>Student</span><strong>{displayData.studentName}</strong></div>}
        </div>
        <div className="preview-actions">
          <button className="back-btn" onClick={() => setActivePage('filltemplate')}><Icon name="arrow_left" size={14}/> Back to Edit</button>
          <button className="proceed-btn" onClick={() => setActivePage('download')}>Proceed to Download <Icon name="arrow_right" size={14}/></button>
        </div>
      </div>
    </main>
  );
};

// ─────────────────────────────────────────────────────────────
// PAGE: DOWNLOAD
// Hidden iframe receives savedFormData + uploaded file.
// DOCX / PDF buttons trigger generation from that iframe.
//
// incrementTemplateDownloads(templateId) is called the moment a real
// download is triggered — inside downloadDocx() right after posting
// TRIGGER_DOCX, and inside downloadPdf() right before opening the
// print dialog. selectedTemplateObj.id is used as the counter key
// (falls back to selectedTemplate if the object isn't available).
// ─────────────────────────────────────────────────────────────
const DownloadPage = ({ uploadedFile, selectedTemplate, selectedTemplateObj, templateData, savedFormData, setActivePage }) => {
  const iframeRef   = useRef(null);
  const [saved,       setSaved]       = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // Resolve the best available form data
  const resolvedData = (savedFormData && Object.keys(savedFormData).length > 0)
    ? savedFormData
    : ((templateData && Object.keys(templateData).length > 0) ? templateData : (loadFormData() || {}));

  // The template's real id — this is the key used for per-template download counts.
  const templateId = selectedTemplateObj?.id ?? selectedTemplate;

  // Save metadata to backend once
  useEffect(() => {
    if (!uploadedFile) return;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch('http://localhost:5000/api/documents/save-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            originalName:  uploadedFile.name,
            formattedName: uploadedFile.name.replace('.docx', '_KJ_Formatted.docx'),
            template:      selectedTemplate || 'mca',
            templateData:  resolvedData,
            fileSizeKB:    Math.round(uploadedFile.size / 1024),
          }),
        });
        setSaved(true);
      } catch (_) {}
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe || !uploadedFile) return;

    // 1. Restore form data into the hidden iframe (cover page, cert, TOC)
    restoreFormInIframe(iframe, resolvedData, 300);

    // 2. Send the uploaded DOCX file
    const reader = new FileReader();
    reader.onload = (e) => {
      setTimeout(() => {
        try {
          iframe.contentWindow.postMessage(
            { type: 'DOCX_FILE', buffer: e.target.result, filename: uploadedFile.name }, '*'
          );
        } catch (_) {}
        setIframeReady(true);
      }, 500);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  const downloadDocx = () => {
    const delay = iframeReady ? 200 : 800;
    setTimeout(() => {
      try {
        iframeRef.current?.contentWindow.postMessage({ type: 'TRIGGER_DOCX' }, '*');
        // Count this as a real download: the DOCX generation + browser save
        // is fired right here, so this is the actual point of download.
        incrementTemplateDownloads(templateId);
      } catch (_) {}
    }, delay);
  };

  const downloadPdf = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    try {
      const doc = iframe.contentDocument;
      const old = doc.getElementById('print-override');
      if (old) old.remove();
      const style = doc.createElement('style');
      style.id = 'print-override';
      style.textContent = `
        @page { size: 210mm 297mm; margin: 0 !important; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
          .form-panel { display: none !important; }
          .preview-panel { padding: 0 !important; background: white !important; display: block !important; }
          .preview-panel h4, .preview-section-title { display: none !important; }
          .a4-page, .a4-doc-page, .a4-content-page {
            box-shadow: none !important; margin: 0 !important;
            width: 210mm !important; height: 297mm !important; min-height: 297mm !important;
            max-height: 297mm !important; page-break-after: always !important;
            break-after: page !important; overflow: hidden !important;
            position: relative !important; box-sizing: border-box !important;
          }
        }
      `;
      doc.head.appendChild(style);
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      // Count this as a real download. We can't detect whether the user
      // actually clicked "Save" vs "Cancel" in the OS print dialog (browsers
      // don't expose that), so triggering the print flow is the best
      // available signal for "the student downloaded the PDF."
      incrementTemplateDownloads(templateId);
    } catch (err) { console.error(err); }
  };

  const fileSizeKB    = uploadedFile ? Math.round(uploadedFile.size / 1024) : 0;
  const formattedName = uploadedFile?.name.replace('.docx', '_KJ_Formatted.docx') || 'document.docx';

  if (!uploadedFile) return (
    <main className="content">
      <div style={{ textAlign:'center', padding: 80 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
        <h2 style={{ marginBottom: 10 }}>No Document Found</h2>
        <p style={{ color: 'var(--text3)', marginBottom: 24 }}>Please upload a document first.</p>
        <button className="proceed-btn" onClick={() => setActivePage('upload')}>Go to Upload</button>
      </div>
    </main>
  );

  return (
    <main className="content">
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Download Document</h1>
        <button className="back-btn" onClick={() => setActivePage('preview')}><Icon name="arrow_left" size={14}/> Back to Preview</button>
      </div>
      <p className="page-sub">Your formatted document is ready to download</p>

      <div className="dl-creative-wrap">
        {/* Hero card */}
        <div className="dl-hero">
          <div className="dl-file-badge">
            <Icon name="file" size={13}/> Formatted Document Ready
            {saved && <span style={{ color:'#28c840' }}> · ✓ Saved to account</span>}
          </div>
          <div className="dl-filename">{formattedName}</div>
          <div className="dl-meta-row">
            <div className="dl-meta-chip"><span>Template: <strong>{selectedTemplate?.toUpperCase() || 'MCA'}</strong></span></div>
            <div className="dl-meta-chip"><span>Size: <strong>~{fileSizeKB} KB</strong></span></div>
            <div className="dl-meta-chip"><span>Font: <strong>Times New Roman</strong></span></div>
            {resolvedData?.studentName && <div className="dl-meta-chip"><span>Student: <strong>{resolvedData.studentName}</strong></span></div>}
            {resolvedData?.subjectName && <div className="dl-meta-chip"><span>Subject: <strong>{resolvedData.subjectName}</strong></span></div>}
          </div>

          {/* Download action cards */}
          <div className="dl-action-grid">
            <button className="dl-action-card docx" onClick={downloadDocx}>
              <div className="dl-card-icon">📄</div>
              <div className="dl-card-title red">Word Document</div>
              <div className="dl-card-desc">
                Fully formatted DOCX with cover page, certificate, TOC, and your document — ready to print or submit.
              </div>
              <span className="dl-card-ext red">.docx</span>
            </button>
            <button className="dl-action-card pdf" onClick={downloadPdf}>
              <div className="dl-card-icon">📕</div>
              <div className="dl-card-title gold">PDF Document</div>
              <div className="dl-card-desc">
                Opens browser print dialog. Set destination to <strong style={{color:'#aaa'}}>"Save as PDF"</strong> and disable headers/footers.
              </div>
              <span className="dl-card-ext gold">.pdf</span>
            </button>
          </div>

          <button className="dl-return-btn" style={{ marginTop: 8 }} onClick={() => setActivePage('dashboard')}>
            <Icon name="home" size={13}/> Return to Dashboard
          </button>
        </div>

        {/* Steps guide */}
        <div className="dl-steps">
          <h4>HOW TO USE YOUR DOWNLOAD</h4>
          <div className="dl-step-row">
            <div className="dl-step-num">1</div>
            <div className="dl-step-text">Click <strong>Word Document</strong> to download the complete .docx with logo, borders, TOC, certificate, and your practical content.</div>
          </div>
          <div className="dl-step-row">
            <div className="dl-step-num">2</div>
            <div className="dl-step-text">For <strong>PDF</strong> → click the PDF button → print dialog opens → set <strong>"Save as PDF"</strong> → uncheck headers &amp; footers → Save.</div>
          </div>
          <div className="dl-step-row">
            <div className="dl-step-num">3</div>
            <div className="dl-step-text">Your document is saved in <strong>History</strong> — re-download anytime without re-uploading.</div>
          </div>
        </div>
      </div>

      {/* Hidden iframe — receives form data + file, handles DOCX/PDF generation */}
      <iframe
        ref={iframeRef}
        src="/template.html"
        onLoad={handleIframeLoad}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none', top: 0, left: 0 }}
        title="DOCX Generator"
      />
    </main>
  );
};

// ── PAGE: HISTORY ──
const HistoryPage = () => {
  const [filter,    setFilter]    = useState('all');
  const [history,   setHistory]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [dlLoading, setDlLoading] = useState(null);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res   = await fetch('http://localhost:5000/api/documents/history', { headers: { Authorization: `Bearer ${token}` } });
      const data  = await res.json();
      if (res.ok) setHistory(data.documents || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDownload = async (doc, format) => {
    setDlLoading(`${doc._id}-${format}`);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/documents/download/${doc._id}?format=${format}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href = url;
      a.download = format === 'pdf' ? doc.formattedName.replace('.docx', '.pdf') : doc.formattedName;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (err) { alert('Download failed: ' + err.message); }
    finally { setDlLoading(null); }
  };

  const filtered = filter === 'all' ? history : history.filter(h => h.template === filter);
  const fmtDate  = (iso) => new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });

  return (
    <main className="content">
      <h1 className="page-title">History</h1>
      <p className="page-sub">View and re-download your formatted documents</p>
      <div className="history-filters">
        {['all','mca','bca'].map(f => (
          <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f.toUpperCase()}</button>
        ))}
      </div>
      <div className="history-stats">
        <div className="stat-card"><span>Total</span><strong>{history.length}</strong></div>
        <div className="stat-card"><span>MCA</span><strong className="red">{history.filter(h=>h.template==='mca').length}</strong></div>
        <div className="stat-card"><span>BCA</span><strong className="gold">{history.filter(h=>h.template==='bca').length}</strong></div>
      </div>
      {loading ? (
        <div style={{ textAlign:'center', padding: 60 }}>
          <div className="doc-viewer-spinner" style={{ margin:'0 auto 16px' }}/>
          <p style={{ color:'var(--text3)', fontSize:14 }}>Loading history…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:60, background:'var(--surface)', borderRadius:16, border:'1px solid var(--border)' }}>
          <div style={{ fontSize:40, marginBottom:16 }}>📂</div>
          <h3 style={{ marginBottom:8 }}>No documents yet</h3>
          <p style={{ color:'var(--text3)', fontSize:14 }}>Format a document and it'll appear here automatically.</p>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map(doc => (
            <div className="history-item" key={doc._id}>
              <div className="history-icon"><Icon name="file" size={26}/></div>
              <div className="history-info">
                <h4>{doc.formattedName}</h4>
                <p>{doc.template.toUpperCase()} Template{doc.templateData?.subjectName ? ` • ${doc.templateData.subjectName}` : ''} • {doc.fileSizeKB} KB • {fmtDate(doc.createdAt)}</p>
              </div>
              <button className="hist-dl-btn" style={{ marginRight:8 }} onClick={() => handleDownload(doc,'docx')} disabled={dlLoading===`${doc._id}-docx`}>
                <Icon name="download" size={13}/>{dlLoading===`${doc._id}-docx`?'…':'DOCX'}
              </button>
              <button className="hist-dl-btn" style={{ background:'rgba(200,160,32,0.1)', borderColor:'rgba(200,160,32,0.3)', color:'var(--gold)' }} onClick={() => handleDownload(doc,'pdf')} disabled={dlLoading===`${doc._id}-pdf`}>
                <Icon name="download" size={13}/>{dlLoading===`${doc._id}-pdf`?'…':'PDF'}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

// ── PAGE: PROFILE ──
const ProfilePage = () => {
  const stored = JSON.parse(localStorage.getItem('user') || '{}');
  const user = {
    fullName:     stored.fullName || 'Student',
    email:        stored.email || '',
    department:   (stored.program || 'MCA') + ' Department',
    studentId:    stored.email?.split('@')[0].toUpperCase() || '—',
    academicYear: '2025-2026',
  };
  const initials = user.fullName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase();
  return (
    <main className="content">
      <h1 className="page-title">Profile</h1>
      <p className="page-sub">Manage your account settings and preferences</p>
      <div className="profile-layout">
        <div className="profile-left-card">
          <div className="profile-avatar-ring">{initials}</div>
          <h2>{user.fullName}</h2>
          <p className="profile-dept">{user.department}</p>
          <div className="profile-left-details">
            <div className="pld-item"><span>Student ID</span><strong>{user.studentId}</strong></div>
            <div className="pld-item"><span>Email</span><strong style={{fontSize:12}}>{user.email}</strong></div>
          </div>
        </div>
        <div className="profile-right">
          <div className="profile-info-card">
            <h3>Account Information <button className="edit-btn"><Icon name="edit" size={14}/> Edit</button></h3>
            <div className="info-grid">
              <div className="info-field"><span>Full Name</span><div className="field-val">{user.fullName}</div></div>
              <div className="info-field"><span>Email</span><div className="field-val">{user.email}</div></div>
              <div className="info-field" style={{gridColumn:'1/-1'}}><span>Academic Year</span><div className="field-val">{user.academicYear}</div></div>
            </div>
          </div>
          <div className="danger-card">
            <h3>Danger Zone</h3>
            <div className="danger-row">
              <div><h4>Delete Account</h4><p>Permanently delete your account and all data</p></div>
              <button className="delete-btn" onClick={() => { if(window.confirm('Are you sure?')) { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href='/register'; }}}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// ── LOGOUT MODAL ──
const LogoutModal = ({ onCancel, onConfirm }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal-box" onClick={e=>e.stopPropagation()}>
      <button className="modal-close" onClick={onCancel}>✕</button>
      <div className="modal-warn-icon"><Icon name="warn" size={28}/></div>
      <h2>Logout?</h2>
      <p>Are you sure you want to logout? You'll need to sign in again to access your documents.</p>
      <div className="modal-buttons">
        <button className="modal-cancel" onClick={onCancel}>Cancel</button>
        <button className="modal-confirm" onClick={onConfirm}><Icon name="logout" size={16}/> Logout</button>
      </div>
      <div className="modal-note">Your work will be saved automatically</div>
    </div>
  </div>
);

// ── NAV CONFIG ──
const NAV_ITEMS = [
  { id:'dashboard',    label:'Dashboard',       icon:'grid'     },
  { id:'upload',       label:'Upload Document', icon:'upload'   },
  { id:'template',     label:'Choose Template', icon:'file'     },
  { id:'filltemplate', label:'Fill Template',   icon:'edit'     },
  { id:'preview',      label:'Preview',         icon:'eye'      },
  { id:'download',     label:'Download',        icon:'download' },
  { id:'history',      label:'History',         icon:'clock'    },
  { id:'profile',      label:'Profile',         icon:'user'     },
];

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// Single source of truth: savedFormData flows from
// FillTemplatePage → PreviewPage → DownloadPage
// ─────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [activePage,       setActivePage]       = useState('dashboard');
  const [uploadedFile,     setUploadedFile]     = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedTemplateObj, setSelectedTemplateObj] = useState(null);
  const [showLogout,       setShowLogout]       = useState(false);
  const [templateData,     setTemplateData]     = useState(() => loadFormData() || {});
  const [savedFormData,    setSavedFormData]    = useState(() => loadFormData() || null);

  const stored   = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = stored.fullName || 'Student';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Catch any TEMPLATE_DATA message that bubbles up (e.g. from FillTemplatePage's iframe)
  useEffect(() => {
    const handler = (e) => {
      if (e.data && e.data.type === 'TEMPLATE_DATA') {
        setTemplateData(e.data.payload);
        setSavedFormData(e.data.payload);
        saveFormData(e.data.payload);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Called by FillTemplatePage when the user saves
  const handleTemplateDataChange = (data) => {
    setTemplateData(data);
    setSavedFormData(data);
    saveFormData(data);
  };

  // Collapse sidebar on the two full-screen pages
  const sidebarCollapsed = activePage === 'filltemplate' || activePage === 'preview';

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardHome setActivePage={setActivePage}/>;

      case 'upload':
        return <UploadPage onFileUpload={setUploadedFile} uploadedFile={uploadedFile} setActivePage={setActivePage}/>;

      case 'template':
        return (
          <TemplatePage
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onSelectTemplateObj={setSelectedTemplateObj}
            setActivePage={setActivePage}
          />
        );

      case 'filltemplate':
        return (
          <FillTemplatePage
            setActivePage={setActivePage}
            uploadedFile={uploadedFile}
            onTemplateDataChange={handleTemplateDataChange}
            savedFormData={savedFormData}
            selectedTemplateObj={selectedTemplateObj}
          />
        );

      case 'preview':
        return (
          <PreviewPage
            uploadedFile={uploadedFile}
            selectedTemplate={selectedTemplate}
            templateData={templateData}
            savedFormData={savedFormData}
            setActivePage={setActivePage}
          />
        );

      case 'download':
        return (
          <DownloadPage
            uploadedFile={uploadedFile}
            selectedTemplate={selectedTemplate}
            selectedTemplateObj={selectedTemplateObj}
            templateData={templateData}
            savedFormData={savedFormData}
            setActivePage={setActivePage}
          />
        );

      case 'history':
        return <HistoryPage/>;

      case 'profile':
        return <ProfilePage/>;

      default:
        return <DashboardHome setActivePage={setActivePage}/>;
    }
  };
  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <aside className={`sidebar${sidebarCollapsed ? ' icons-only' : ''}`}>
          <div className="sidebar-logo" onClick={() => window.location.href='/'}>
            <span className="logo-icon">F</span>
            <span className="logo-text">FORMATIFY</span>
          </div>
          <nav className="nav">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`nav-item${activePage===item.id?' active':''}`}
                onClick={() => setActivePage(item.id)}
                title={item.label}
              >
                <span className="nav-icon"><Icon name={item.icon} size={16}/></span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
            <button className="nav-item nav-logout" onClick={() => setShowLogout(true)} title="Logout">
              <span className="nav-icon"><Icon name="logout" size={16}/></span>
              <span className="nav-label">Logout</span>
            </button>
          </nav>
        </aside>

        <div className="main">
          <header className="header">
            <div>
              <h3>Welcome Back, {userName}</h3>
              <p>Manage your academic documents efficiently</p>
            </div>
            <div className="header-avatar" onClick={() => setActivePage('profile')}>
              {userName.charAt(0).toUpperCase()}
            </div>
          </header>
          {renderPage()}
        </div>
      </div>
      {showLogout && <LogoutModal onCancel={() => setShowLogout(false)} onConfirm={handleLogout}/>}
    </>
  );
};

export default Dashboard;