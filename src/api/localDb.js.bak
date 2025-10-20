// Local storage helpers for collections
const STORAGE_PREFIX = 'local_';

function getKey(name) {
  return STORAGE_PREFIX + name;
}

export function loadCollection(name) {
  try {
    const raw = localStorage.getItem(getKey(name));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCollection(name, items) {
  try {
    localStorage.setItem(getKey(name), JSON.stringify(items || []));
  } catch {
    // ignore
  }
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
} 