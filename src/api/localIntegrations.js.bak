const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export async function UploadFile({ file }) {
  if (API_BASE) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: fd });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    // If API_BASE is absolute, return absolute URL; else return relative path which frontend can resolve
    const url = json.file_url.startsWith('http') ? json.file_url : `${API_BASE}${json.file_url}`;
    return { file_url: url };
  }
  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  const file_url = await readAsDataURL(file);
  return { file_url };
}

function parseCsv(text) {
  const rows = [];
  let currentRow = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      currentRow.push(field);
      field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      // handle CRLF
      if (ch === '\r' && text[i + 1] === '\n') i++;
      currentRow.push(field);
      rows.push(currentRow);
      currentRow = [];
      field = '';
    } else {
      field += ch;
    }
  }
  // flush last field/row
  if (field.length > 0 || currentRow.length > 0) {
    currentRow.push(field);
    rows.push(currentRow);
  }

  if (rows.length === 0) return [];
  const headers = rows[0];
  const dataRows = rows.slice(1).filter(r => r.some(v => String(v || '').trim() !== ''));
  return dataRows.map(r => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = r[idx] ?? '';
    });
    return obj;
  });
}

export async function ExtractDataFromUploadedFile({ file_url, json_schema }) {
  try {
    const res = await fetch(file_url);
    const text = await res.text();
    const data = parseCsv(text);
    return { status: 'ok', output: data };
  } catch (e) {
    return { status: 'error', details: e?.message || 'Failed to parse CSV' };
  }
}

export async function InvokeLLM({ prompt }) {
  // Simple mock that returns 5 Q&A pairs derived from prompt
  const title = (prompt || '').split('\n')[0].slice(0, 48) || 'Product';
  const make = (i) => ({
    question: `Q${i + 1}: What about ${title}?`,
    answer: `A${i + 1}: This is an auto-generated answer for ${title}.`,
  });
  return { q_and_a: Array.from({ length: 5 }, (_, i) => make(i)) };
} 