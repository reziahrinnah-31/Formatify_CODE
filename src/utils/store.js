// ── store.js ──────────────────────────────────────────────────
// Centralised localStorage helpers for Formatify.
// All keys are prefixed with "kj_" to avoid collisions.

const TEMPLATES_KEY        = 'kj_templates';
const DOCS_FORMATTED_KEY   = 'kj_docs_formatted';
const TEMPLATE_DOWNLOADS_KEY = 'kj_template_downloads'; // map: { [templateId]: count }

// ── Templates ────────────────────────────────────────────────

export function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

export function saveTemplates(templates) {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (_) {}
}

export function addTemplate(template) {
  const templates = getTemplates();
  templates.push(template);
  saveTemplates(templates);
}

export function updateTemplate(id, updates) {
  const templates = getTemplates().map(t =>
    String(t.id) === String(id) ? { ...t, ...updates } : t
  );
  saveTemplates(templates);
}

export function deleteTemplate(id) {
  saveTemplates(getTemplates().filter(t => String(t.id) !== String(id)));
}

// ── Global docs-formatted counter ────────────────────────────

export function getDocsFormatted() {
  return parseInt(localStorage.getItem(DOCS_FORMATTED_KEY) || '0', 10);
}

export function incrementDocsFormatted() {
  localStorage.setItem(DOCS_FORMATTED_KEY, String(getDocsFormatted() + 1));
}

// ── Per-template download counters ───────────────────────────

function getDownloadMap() {
  try {
    return JSON.parse(localStorage.getItem(TEMPLATE_DOWNLOADS_KEY) || '{}');
  } catch (_) {
    return {};
  }
}

function saveDownloadMap(map) {
  try {
    localStorage.setItem(TEMPLATE_DOWNLOADS_KEY, JSON.stringify(map));
  } catch (_) {}
}

/** Returns the download count for a single template. */
export function getTemplateDownloads(templateId) {
  return getDownloadMap()[String(templateId)] || 0;
}

/** Returns the full map { [templateId]: count } — useful for admin views. */
export function getAllTemplateDownloads() {
  return getDownloadMap();
}

/**
 * Increments the per-template counter AND the global docs-formatted counter
 * in one call.  Dashboard.jsx only needs to call this function — no need to
 * also call incrementDocsFormatted() separately.
 */
export function incrementTemplateDownloads(templateId) {
  // Per-template count
  const map = getDownloadMap();
  const key = String(templateId);
  map[key] = (map[key] || 0) + 1;
  saveDownloadMap(map);

  // Global count (keeps the admin "Documents Formatted" stat in sync)
  incrementDocsFormatted();
}

// ── Users (local registry for admin dashboard) ───────────────
// NOTE: Real auth (token, password) is handled by the backend.
// This just keeps a lightweight list of registered users so the
// admin dashboard can display a student count without an API call.

const USERS_KEY = 'kj_users';

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

/**
 * Called after a successful backend registration to record the user
 * locally for the admin dashboard's student count.
 * Expects: { name, email, dept }
 * Ignores duplicates (same email won't be added twice).
 */
export function registerUser({ name, email, dept }) {
  const users = getUsers();
  if (users.some(u => u.email === email)) return; // already recorded
  users.push({ name, email, dept, joinedAt: new Date().toISOString() });
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (_) {}
}