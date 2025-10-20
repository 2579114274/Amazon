import { loadCollection, saveCollection, generateId } from './localDb';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_FALLBACK = API_BASE || (typeof window !== 'undefined' ? window.location.origin : '');
const hasServer = !!API_BASE;

async function apiGet(collection, sort) {
  const url = new URL(`${API_BASE_FALLBACK}/api/${collection}`);
  if (sort) url.searchParams.set('sort', sort);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`GET ${collection} failed`);
  return res.json();
}
async function apiPost(collection, data) {
  const res = await fetch(`${API_BASE}/api/${collection}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`POST ${collection} failed`);
  return res.json();
}
async function apiPut(collection, id, data) {
  const res = await fetch(`${API_BASE}/api/${collection}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`PUT ${collection} failed`);
  return res.json();
}
async function apiDelete(collection, id) {
  const res = await fetch(`${API_BASE}/api/${collection}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${collection} failed`);
  return res.json();
}

function clientFilter(items, where) {
  const keys = Object.keys(where || {});
  if (keys.length === 0) return items;
  return items.filter((it) => keys.every((k) => String(it[k]) === String(where[k])));
}

function sortBy(items, key, desc = false) {
  const get = (obj) => {
    const v = obj[key];
    if (v == null) return '';
    return v;
  };
  const sorted = [...items].sort((a, b) => {
    const va = get(a);
    const vb = get(b);
    if (va < vb) return -1;
    if (va > vb) return 1;
    return 0;
  });
  return desc ? sorted.reverse() : sorted;
}

// Products
const PRODUCTS_KEY = 'products';
export const LocalProduct = {
  async list(order) {
    if (hasServer) {
      return apiGet('products', order || '');
    }
    let items = loadCollection(PRODUCTS_KEY);
    items = items.map((p) => ({ ...p, created_date: p.created_date || new Date().toISOString() }));
    if (order === '-created_date') {
      items = sortBy(items, 'created_date', true);
    }
    return items;
  },
  async filter(where) {
    if (hasServer) {
      const items = await apiGet('products');
      return clientFilter(items, where);
    }
    const items = loadCollection(PRODUCTS_KEY);
    return clientFilter(items, where);
  },
  async create(data) {
    if (hasServer) return apiPost('products', data);
    const items = loadCollection(PRODUCTS_KEY);
    const now = new Date().toISOString();
    const item = {
      id: generateId('prod'),
      created_date: now,
      updated_date: now,
      ...data,
    };
    items.unshift(item);
    saveCollection(PRODUCTS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('products', id, data);
    const items = loadCollection(PRODUCTS_KEY);
    const idx = items.findIndex((p) => String(p.id) === String(id));
    if (idx === -1) throw new Error('Product not found');
    const updated = { ...items[idx], ...data, updated_date: new Date().toISOString() };
    items[idx] = updated;
    saveCollection(PRODUCTS_KEY, items);
    return updated;
  },
  async delete(id) {
    if (hasServer) return apiDelete('products', id);
    const items = loadCollection(PRODUCTS_KEY);
    const next = items.filter((p) => String(p.id) !== String(id));
    saveCollection(PRODUCTS_KEY, next);
    return { success: true };
  },
};

// Categories
const CATEGORIES_KEY = 'categories';
export const LocalCategory = {
  async list() {
    if (hasServer) return apiGet('categories');
    return loadCollection(CATEGORIES_KEY);
  },
  async create(data) {
    if (hasServer) return apiPost('categories', data);
    const items = loadCollection(CATEGORIES_KEY);
    const item = { id: generateId('cat'), sort_order: 0, ...data };
    items.push(item);
    saveCollection(CATEGORIES_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('categories', id, data);
    const items = loadCollection(CATEGORIES_KEY);
    const idx = items.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw new Error('Category not found');
    items[idx] = { ...items[idx], ...data };
    saveCollection(CATEGORIES_KEY, items);
    return items[idx];
  },
  async delete(id) {
    if (hasServer) return apiDelete('categories', id);
    const items = loadCollection(CATEGORIES_KEY);
    const next = items.filter((c) => String(c.id) !== String(id));
    saveCollection(CATEGORIES_KEY, next);
    return { success: true };
  },
};

// Pixel settings (single record)
const PIXEL_SETTINGS_KEY = 'pixel_settings';
export const LocalPixelSettings = {
  async list() {
    if (hasServer) return apiGet('pixel_settings');
    const items = loadCollection(PIXEL_SETTINGS_KEY);
    return items;
  },
  async create(data) {
    if (hasServer) return apiPost('pixel_settings', data);
    const items = loadCollection(PIXEL_SETTINGS_KEY);
    const item = { id: generateId('px'), ...data };
    items.push(item);
    saveCollection(PIXEL_SETTINGS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('pixel_settings', id, data);
    const items = loadCollection(PIXEL_SETTINGS_KEY);
    const idx = items.findIndex((s) => String(s.id) === String(id));
    if (idx === -1) throw new Error('Pixel settings not found');
    items[idx] = { ...items[idx], ...data };
    saveCollection(PIXEL_SETTINGS_KEY, items);
    return items[idx];
  },
};

// Currency
const CURRENCIES_KEY = 'currencies';
export const LocalCurrency = {
  async list(order) {
    if (hasServer) return apiGet('currencies', order || '');
    let items = loadCollection(CURRENCIES_KEY);
    items = items.map((c) => ({ ...c, created_date: c.created_date || new Date().toISOString() }));
    if (order === '-created_date') items = sortBy(items, 'created_date', true);
    return items;
  },
  async create(data) {
    if (hasServer) return apiPost('currencies', data);
    const items = loadCollection(CURRENCIES_KEY);
    const now = new Date().toISOString();
    const item = { id: generateId('cur'), created_date: now, updated_date: now, ...data };
    items.unshift(item);
    saveCollection(CURRENCIES_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('currencies', id, data);
    const items = loadCollection(CURRENCIES_KEY);
    const idx = items.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw new Error('Currency not found');
    items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
    saveCollection(CURRENCIES_KEY, items);
    return items[idx];
  },
  async delete(id) {
    if (hasServer) return apiDelete('currencies', id);
    const items = loadCollection(CURRENCIES_KEY);
    const next = items.filter((c) => String(c.id) !== String(id));
    saveCollection(CURRENCIES_KEY, next);
    return { success: true };
  },
};

// Order
const ORDERS_KEY = 'orders';
export const LocalOrder = {
  async list(order) {
    if (hasServer) return apiGet('orders', order || '');
    let items = loadCollection(ORDERS_KEY);
    items = items.map((o) => ({ ...o, created_date: o.created_date || new Date().toISOString(), order_status: o.order_status || 'pending' }));
    if (order === '-created_date') items = sortBy(items, 'created_date', true);
    return items;
  },
  async create(data) {
    if (hasServer) return apiPost('orders', data);
    const items = loadCollection(ORDERS_KEY);
    const now = new Date().toISOString();
    const item = { id: generateId('ord'), created_date: now, updated_date: now, order_status: 'pending', ...data };
    items.unshift(item);
    saveCollection(ORDERS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('orders', id, data);
    const items = loadCollection(ORDERS_KEY);
    const idx = items.findIndex((o) => String(o.id) === String(id));
    if (idx === -1) throw new Error('Order not found');
    items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
    saveCollection(ORDERS_KEY, items);
    return items[idx];
  },
  async delete(id) {
    if (hasServer) return apiDelete('orders', id);
    const items = loadCollection(ORDERS_KEY);
    const next = items.filter((o) => String(o.id) !== String(id));
    saveCollection(ORDERS_KEY, next);
    return { success: true };
  },
};

// Site settings (single record)
const SITE_SETTINGS_KEY = 'site_settings';
export const LocalSiteSettings = {
  async list() {
    if (hasServer) return apiGet('site_settings');
    return loadCollection(SITE_SETTINGS_KEY);
  },
  async create(data) {
    if (hasServer) return apiPost('site_settings', data);
    const items = loadCollection(SITE_SETTINGS_KEY);
    const item = { id: generateId('site'), ...data };
    items.splice(0, items.length, item);
    saveCollection(SITE_SETTINGS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('site_settings', id, data);
    let items = loadCollection(SITE_SETTINGS_KEY);
    if (items.length === 0) return this.create(data);
    items[0] = { ...items[0], ...data };
    saveCollection(SITE_SETTINGS_KEY, items);
    return items[0];
  },
};

// Admin credentials (single record)
const ADMIN_CREDS_KEY = 'admin_credentials';
export const LocalAdminCredentials = {
  async list() {
    if (hasServer) return apiGet('admin_credentials');
    return loadCollection(ADMIN_CREDS_KEY);
  },
  async create(data) {
    if (hasServer) return apiPost('admin_credentials', data);
    const items = loadCollection(ADMIN_CREDS_KEY);
    const item = { id: generateId('admin'), ...data };
    items.splice(0, items.length, item);
    saveCollection(ADMIN_CREDS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('admin_credentials', id, data);
    let items = loadCollection(ADMIN_CREDS_KEY);
    if (items.length === 0) return this.create(data);
    items[0] = { ...items[0], ...data };
    saveCollection(ADMIN_CREDS_KEY, items);
    return items[0];
  },
};

// Cloak settings (single record)
const CLOAK_SETTINGS_KEY = 'cloak_settings';
export const LocalCloakSettings = {
  async list() {
    if (hasServer) return apiGet('cloak_settings');
    return loadCollection(CLOAK_SETTINGS_KEY);
  },
  async create(data) {
    if (hasServer) return apiPost('cloak_settings', data);
    const items = loadCollection(CLOAK_SETTINGS_KEY);
    const item = { id: generateId('cloak'), ...data };
    items.splice(0, items.length, item);
    saveCollection(CLOAK_SETTINGS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('cloak_settings', id, data);
    let items = loadCollection(CLOAK_SETTINGS_KEY);
    if (items.length === 0) return this.create(data);
    items[0] = { ...items[0], ...data };
    saveCollection(CLOAK_SETTINGS_KEY, items);
    return items[0];
  },
};

// Custom Redirects
const CUSTOM_REDIRECTS_KEY = 'custom_redirects';
export const LocalCustomRedirect = {
  async list(order) {
    if (hasServer) return apiGet('custom_redirects', order || '');
    let items = loadCollection(CUSTOM_REDIRECTS_KEY);
    items = items.map((it) => ({ ...it, created_date: it.created_date || new Date().toISOString(), updated_date: it.updated_date || it.created_date }));
    if (order === '-updated_date') items = sortBy(items, 'updated_date', true);
    return items;
  },
  async filter(where) {
    if (hasServer) {
      const items = await apiGet('custom_redirects');
      return clientFilter(items, where);
    }
    const items = loadCollection(CUSTOM_REDIRECTS_KEY);
    return clientFilter(items, where);
  },
  async create(data) {
    if (hasServer) return apiPost('custom_redirects', data);
    const items = loadCollection(CUSTOM_REDIRECTS_KEY);
    const now = new Date().toISOString();
    const item = { id: generateId('redir'), created_date: now, updated_date: now, ...data };
    items.unshift(item);
    saveCollection(CUSTOM_REDIRECTS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('custom_redirects', id, data);
    const items = loadCollection(CUSTOM_REDIRECTS_KEY);
    const idx = items.findIndex((r) => String(r.id) === String(id));
    if (idx === -1) throw new Error('Redirect not found');
    items[idx] = { ...items[idx], ...data, updated_date: new Date().toISOString() };
    saveCollection(CUSTOM_REDIRECTS_KEY, items);
    return items[idx];
  },
  async delete(id) {
    if (hasServer) return apiDelete('custom_redirects', id);
    const items = loadCollection(CUSTOM_REDIRECTS_KEY);
    const next = items.filter((r) => String(r.id) !== String(id));
    saveCollection(CUSTOM_REDIRECTS_KEY, next);
    return { success: true };
  },
};

// Cart items
const CART_ITEMS_KEY = 'cart_items';
export const LocalCartItem = {
  async list() {
    if (hasServer) return apiGet('cart_items');
    return loadCollection(CART_ITEMS_KEY);
  },
  async filter(where) {
    if (hasServer) {
      const items = await apiGet('cart_items');
      return clientFilter(items, where);
    }
    const items = loadCollection(CART_ITEMS_KEY);
    return clientFilter(items, where);
  },
  async create(data) {
    if (hasServer) return apiPost('cart_items', data);
    const items = loadCollection(CART_ITEMS_KEY);
    const item = { id: generateId('cart'), quantity: 1, ...data };
    items.push(item);
    saveCollection(CART_ITEMS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) return apiPut('cart_items', id, data);
    const items = loadCollection(CART_ITEMS_KEY);
    const idx = items.findIndex((c) => String(c.id) === String(id));
    if (idx === -1) throw new Error('Cart item not found');
    items[idx] = { ...items[idx], ...data };
    saveCollection(CART_ITEMS_KEY, items);
    return items[idx];
  },
  async delete(id) {
    if (hasServer) return apiDelete('cart_items', id);
    const items = loadCollection(CART_ITEMS_KEY);
    const next = items.filter((c) => String(c.id) !== String(id));
    saveCollection(CART_ITEMS_KEY, next);
    return { success: true };
  },
};

// Local user placeholder (no auth)
export const LocalUser = {
  async me() {
    return null;
  },
};

// Gemini settings (stored inside site_settings[0].gemini on server)
const GEMINI_SETTINGS_KEY = 'gemini_settings';
export const LocalGeminiSettings = {
  async list() {
    if (hasServer) {
      const items = await apiGet('site_settings');
      const s = Array.isArray(items) && items[0] ? items[0] : {};
      const g = s.gemini || null;
      if (g) return [g];
      return [];
    }
    return loadCollection(GEMINI_SETTINGS_KEY);
  },
  async create(data) {
    if (hasServer) {
      const items = await apiGet('site_settings');
      if (Array.isArray(items) && items[0]) {
        const id = items[0].id;
        const merged = { ...(items[0] || {}), gemini: { ...(items[0]?.gemini || {}), ...data } };
        await apiPut('site_settings', id, merged);
        // refetch with include_key=1 for admin context
        const url = new URL(`${API_BASE_FALLBACK}/api/site_settings`);
        url.searchParams.set('include_key', '1');
        const res = await fetch(url.toString());
        const withKey = res.ok ? await res.json() : [];
        const s = Array.isArray(withKey) && withKey[0] ? withKey[0] : {};
        return s.gemini ? [s.gemini] : [];
      } else {
        const created = await apiPost('site_settings', { gemini: { ...data } });
        return created?.gemini ? [created.gemini] : [];
      }
    }
    const items = loadCollection(GEMINI_SETTINGS_KEY);
    const item = { id: generateId('gem'), ...data };
    items.splice(0, items.length, item);
    saveCollection(GEMINI_SETTINGS_KEY, items);
    return item;
  },
  async update(id, data) {
    if (hasServer) {
      const items = await apiGet('site_settings');
      if (Array.isArray(items) && items[0]) {
        const sid = items[0].id;
        const merged = { ...(items[0] || {}), gemini: { ...(items[0]?.gemini || {}), ...data } };
        await apiPut('site_settings', sid, merged);
        const url = new URL(`${API_BASE_FALLBACK}/api/site_settings`);
        url.searchParams.set('include_key', '1');
        const res = await fetch(url.toString());
        const withKey = res.ok ? await res.json() : [];
        const s = Array.isArray(withKey) && withKey[0] ? withKey[0] : {};
        return s.gemini ? [s.gemini] : [];
      } else {
        const created = await apiPost('site_settings', { gemini: { ...data } });
        return created?.gemini ? [created.gemini] : [];
      }
    }
    const items = loadCollection(GEMINI_SETTINGS_KEY);
    if (items.length === 0) return this.create(data);
    items[0] = { ...items[0], ...data };
    saveCollection(GEMINI_SETTINGS_KEY, items);
    return items[0];
  },
}; 