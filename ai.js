// Scriby's Companion: one place the writer's words may go to a language model, and only when
// they ask. Runs in the main process, like art.js; the window never sees a key or the network.
//
// Two kinds of connection cover everything:
//   openai    — the chat-completions API that Ollama, LM Studio, llama.cpp's server, OpenRouter,
//               Groq, Together and OpenAI itself all speak
//   anthropic — Claude's own API
// "Local" is not a kind: it is an openai-style connection to this computer.

'use strict';

const PROVIDERS = {
  anthropic: { kind: 'anthropic', label: 'Claude', base: 'https://api.anthropic.com', local: false, key: true, model: 'claude-sonnet-5-5' },
  openai: { kind: 'openai', label: 'OpenAI', base: 'https://api.openai.com/v1', local: false, key: true, model: '' },
  ollama: { kind: 'openai', label: 'Ollama', base: 'http://localhost:11434/v1', local: true, key: false, model: '' },
  lmstudio: { kind: 'openai', label: 'LM Studio', base: 'http://localhost:1234/v1', local: true, key: false, model: '' },
  custom: { kind: 'openai', label: 'Custom', base: '', local: false, key: false, model: '' }
};

// Errors carry a code; main.js puts them in the writer's language.
function E(code, extra) { const err = new Error(code); err.code = code; Object.assign(err, extra); return err; }

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);

// Where a request would go, or why it must not: a remote address has to be https, so a typo
// can't send a book over plain http; a local one may be http.
function target(cfg) {
  const def = PROVIDERS[cfg.provider];
  if (!def) throw E('NO_PROVIDER');
  const base = String(cfg.base || def.base || '').trim().replace(/\/+$/, '');
  if (!base) throw E('NO_ADDRESS');
  let u;
  try { u = new URL(base); } catch { throw E('BAD_ADDRESS'); }
  const local = LOCAL_HOSTS.has(u.hostname);
  if (def.local && !local) throw E('NOT_LOCAL');
  if (!local && u.protocol !== 'https:') throw E('NOT_HTTPS');
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw E('BAD_ADDRESS');
  return { base, host: u.host, local, kind: def.kind };
}

function headers(kind, key) {
  const h = { 'Content-Type': 'application/json' };
  if (kind === 'anthropic') { h['x-api-key'] = key || ''; h['anthropic-version'] = '2023-06-01'; } else if (key) h.Authorization = 'Bearer ' + key;
  return h;
}

function explain(err, where) {
  if (err && (err.name === 'AbortError' || err.code)) return err;
  const cause = err && err.cause && err.cause.code;
  if (cause === 'ECONNREFUSED' || /fetch failed/i.test(String(err && err.message))) return E('UNREACHABLE', { host: where });
  if (err && err.name === 'TimeoutError') return E('UNREACHABLE', { host: where });
  return E('SERVER', { detail: String(err && err.message || err) });
}

async function failure(res) {
  let msg = '';
  try {
    const body = await res.json();
    msg = (body && body.error && (body.error.message || body.error)) || body.message || '';
    if (typeof msg !== 'string') msg = JSON.stringify(msg);
  } catch { /* not JSON */ }
  return E(res.status === 401 || res.status === 403 ? 'KEY_REFUSED' : 'SERVER', { status: res.status, detail: msg || String(res.status) });
}

// The models the server offers, for the Settings list. Not every server can say; then the
// writer types a name.
async function listModels(cfg, key) {
  const t = target(cfg);
  const url = t.kind === 'anthropic' ? t.base + '/v1/models?limit=100' : t.base + '/models';
  let res;
  try { res = await fetch(url, { headers: headers(t.kind, key), signal: AbortSignal.timeout(8000) }); } catch (err) { throw explain(err, t.host); }
  if (!res.ok) throw await failure(res);
  const body = await res.json();
  const rows = Array.isArray(body.data) ? body.data : Array.isArray(body.models) ? body.models : [];
  return rows.map((m) => String(m.id || m.name || '')).filter(Boolean).sort();
}

// Server-sent events: the stream's `data:` lines, whole, as they arrive.
async function* events(res) {
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    let at;
    while ((at = buf.search(/\r?\n\r?\n/)) >= 0) {
      const block = buf.slice(0, at);
      buf = buf.slice(at).replace(/^\r?\n\r?\n/, '');
      const data = block.split(/\r?\n/).filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).join('\n');
      if (data) yield data;
    }
  }
}

// One answer, token by token. messages: [{ role: 'user' | 'assistant', content }].
async function chat(cfg, key, { system, messages, signal, onToken, maxTokens = 2048, temperature = 0.9 }) {
  const t = target(cfg);
  if (!cfg.model) throw E('NO_MODEL');
  let url, body;
  if (t.kind === 'anthropic') {
    url = t.base + '/v1/messages';
    body = { model: cfg.model, max_tokens: maxTokens, temperature: Math.min(1, temperature), system, messages, stream: true };
  } else {
    url = t.base + '/chat/completions';
    body = { model: cfg.model, messages: [{ role: 'system', content: system }, ...messages], temperature, stream: true };
  }
  let res;
  try { res = await fetch(url, { method: 'POST', headers: headers(t.kind, key), body: JSON.stringify(body), signal }); } catch (err) { throw explain(err, t.host); }
  if (!res.ok) throw await failure(res);
  let all = '';
  for await (const data of events(res)) {
    if (data === '[DONE]') break;
    let j;
    try { j = JSON.parse(data); } catch { continue; }
    let piece = '';
    if (t.kind === 'anthropic') {
      if (j.type === 'content_block_delta' && j.delta && j.delta.type === 'text_delta') piece = j.delta.text || '';
      else if (j.type === 'error') throw E('SERVER', { detail: (j.error && j.error.message) || '' });
    } else {
      const c = j.choices && j.choices[0];
      piece = (c && c.delta && c.delta.content) || '';
    }
    if (piece) { all += piece; onToken(piece); }
  }
  return all;
}

module.exports = { PROVIDERS, target, listModels, chat };
