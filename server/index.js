// Simple JSON-file backed API server for persistence
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const __dirname = path.resolve();
const app = express();
const PORT = process.env.PORT || 8787;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// 先定义所有函数
function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function ensureCollection(db, name) {
  if (!db[name]) db[name] = [];
}

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// 创建目录和初始化数据库
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({
  products: [],
  categories: [],
  currencies: [],
  orders: [],
  pixel_settings: [],
  cloak_settings: [],
  custom_redirects: [],
  site_settings: [],
  admin_credentials: [],
  cart_items: []
}, null, 2));

app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(UPLOAD_DIR));

// 健康检查必须在 /api/:collection 之前
app.get('/api/health', (req, res) => res.json({ ok: true }));

// 文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2,8)}${ext}`);
  }
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.json({ file_url: publicUrl });
});

// Gemini API 代理
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-1.5-flash' } = req.body;
    
    // 直接使用环境变量中的完整密钥
    const apiKey = "AIzaSyAljKO0PF55_Vaa_tBNH1DFP6ZLphozTXM";
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Valid Gemini API key not found' });
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Gemini API error:', error);
    res.status(500).json({ error: error.message });
  }
});

// 获取可用的Gemini模型
app.get('/api/gemini/models', async (req, res) => {
  try {
    // 直接使用环境变量中的完整密钥
    const apiKey = "AIzaSyAljKO0PF55_Vaa_tBNH1DFP6ZLphozTXM";
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Valid Gemini API key not found' });
    }
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: {
        'x-goog-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
    
  } catch (error) {
    console.error('Gemini models error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generic CRUD routes: /api/:collection
const VALID_COLLECTIONS = new Set([
  'products','categories','currencies','orders','pixel_settings','cloak_settings','custom_redirects','site_settings','admin_credentials','cart_items'
]);

app.get('/api/:collection', (req, res) => {
  const { collection } = req.params;
  if (!VALID_COLLECTIONS.has(collection)) return res.status(404).json({ error: 'Invalid collection' });
  const { sort, include_key } = req.query;
  const db = readDB();
  ensureCollection(db, collection);
  let list = db[collection];
  if (collection === 'site_settings' && include_key !== '1') {
    // Mask gemini.api_key for public reads
    list = (list || []).map((it) => {
      const masked = JSON.parse(JSON.stringify(it || {}));
      const key = masked?.gemini?.api_key;
      if (key && typeof key === 'string') {
        const suf = key.slice(-4);
        masked.gemini.api_key = `****${suf}`;
      }
      return masked;
    });
  }
  if (sort) {
    const desc = sort.startsWith('-');
    const key = desc ? sort.slice(1) : sort;
    list = [...list].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0));
    if (desc) list.reverse();
  }
  res.json(list);
});

app.post('/api/:collection', (req, res) => {
  const { collection } = req.params;
  if (!VALID_COLLECTIONS.has(collection)) return res.status(404).json({ error: 'Invalid collection' });
  const db = readDB();
  ensureCollection(db, collection);
  const now = new Date().toISOString();
  const id = generateId(collection.slice(0, 3));
  const item = { id, created_date: now, updated_date: now, ...req.body };
  db[collection].unshift(item);
  writeDB(db);
  res.json(item);
});

app.put('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  if (!VALID_COLLECTIONS.has(collection)) return res.status(404).json({ error: 'Not found' });
  const db = readDB();
  ensureCollection(db, collection);
  const idx = db[collection].findIndex(it => String(it.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db[collection][idx] = { ...db[collection][idx], ...req.body, updated_date: new Date().toISOString() };
  writeDB(db);
  res.json(db[collection][idx]);
});

app.delete('/api/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  if (!VALID_COLLECTIONS.has(collection)) return res.status(404).json({ error: 'Not found' });
  const db = readDB();
  ensureCollection(db, collection);
  db[collection] = db[collection].filter(it => String(it.id) !== String(id));
  writeDB(db);
  res.json({ success: true });
});

// 最后启动服务器
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});