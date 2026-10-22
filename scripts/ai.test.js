// The Companion's connection layer (ai.js): where a request may go, and both kinds of stream.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const ai = require('../ai.js');

const code = (fn) => { try { fn(); } catch (err) { return err.code; } return null; };

test('a remote address has to be https; a local one may be http', () => {
  assert.equal(code(() => ai.target({ provider: 'custom', base: 'http://example.com/v1' })), 'NOT_HTTPS');
  assert.equal(ai.target({ provider: 'custom', base: 'https://example.com/v1/' }).base, 'https://example.com/v1');
  assert.equal(ai.target({ provider: 'custom', base: 'http://localhost:8080/v1' }).local, true);
  assert.equal(ai.target({ provider: 'ollama' }).host, 'localhost:11434');
});

test('a "local" provider cannot be pointed away from this computer', () => {
  assert.equal(code(() => ai.target({ provider: 'ollama', base: 'https://example.com/v1' })), 'NOT_LOCAL');
  assert.equal(code(() => ai.target({ provider: 'lmstudio', base: 'http://192.168.1.5:1234/v1' })), 'NOT_LOCAL');
});

test('no address, a non-address, no provider', () => {
  assert.equal(code(() => ai.target({ provider: 'custom', base: '' })), 'NO_ADDRESS');
  assert.equal(code(() => ai.target({ provider: 'custom', base: 'not a url' })), 'BAD_ADDRESS');
  assert.equal(code(() => ai.target({ provider: 'nope' })), 'NO_PROVIDER');
});

function serve(handler) {
  return new Promise((resolve) => {
    const srv = http.createServer(handler).listen(0, '127.0.0.1', () => resolve(srv));
  });
}

test('an OpenAI-style stream arrives token by token, and the request carries the system text', async () => {
  let seen;
  const srv = await serve((req, res) => {
    let body = '';
    req.on('data', (d) => { body += d; });
    req.on('end', () => {
      seen = { url: req.url, auth: req.headers.authorization, body: JSON.parse(body) };
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      for (const w of ['Hel', 'lo ', 'there']) res.write('data: ' + JSON.stringify({ choices: [{ delta: { content: w } }] }) + '\n\n');
      res.end('data: [DONE]\n\n');
    });
  });
  try {
    const got = [];
    const cfg = { provider: 'custom', base: 'http://127.0.0.1:' + srv.address().port + '/v1', model: 'm' };
    const all = await ai.chat(cfg, 'sk-test', { system: 'SYS', messages: [{ role: 'user', content: 'hi' }], onToken: (p) => got.push(p) });
    assert.equal(all, 'Hello there');
    assert.deepEqual(got, ['Hel', 'lo ', 'there']);
    assert.equal(seen.url, '/v1/chat/completions');
    assert.equal(seen.auth, 'Bearer sk-test');
    assert.deepEqual(seen.body.messages[0], { role: 'system', content: 'SYS' });
    assert.equal(seen.body.stream, true);
  } finally { srv.close(); }
});

test('a model is required, and a refused key says so', async () => {
  const srv = await serve((req, res) => { res.writeHead(401, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ error: { message: 'bad key' } })); });
  try {
    const cfg = { provider: 'custom', base: 'http://127.0.0.1:' + srv.address().port + '/v1', model: '' };
    await assert.rejects(ai.chat(cfg, 'k', { system: '', messages: [], onToken() {} }), (e) => e.code === 'NO_MODEL');
    cfg.model = 'm';
    await assert.rejects(ai.chat(cfg, 'k', { system: '', messages: [], onToken() {} }), (e) => e.code === 'KEY_REFUSED' && /bad key/.test(e.detail));
    await assert.rejects(ai.listModels(cfg, 'k'), (e) => e.code === 'KEY_REFUSED');
  } finally { srv.close(); }
});

test('the models a server lists, sorted', async () => {
  const srv = await serve((req, res) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ data: [{ id: 'b' }, { id: 'a' }] })); });
  try {
    assert.deepEqual(await ai.listModels({ provider: 'custom', base: 'http://127.0.0.1:' + srv.address().port + '/v1' }, null), ['a', 'b']);
  } finally { srv.close(); }
});

test('a server that is not running is named, not dumped as a stack', async () => {
  const srv = await serve(() => {});
  const port = srv.address().port;
  srv.close();
  await assert.rejects(ai.listModels({ provider: 'ollama', base: 'http://localhost:' + port + '/v1' }, null), (e) => e.code === 'UNREACHABLE' && /localhost/.test(e.host));
});

test('Claude\'s own stream: text deltas are read, the key goes in x-api-key', async () => {
  let seen;
  const srv = await serve((req, res) => {
    let body = '';
    req.on('data', (d) => { body += d; });
    req.on('end', () => {
      seen = { url: req.url, key: req.headers['x-api-key'], ver: req.headers['anthropic-version'], body: JSON.parse(body) };
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      res.write('event: message_start\ndata: {"type":"message_start"}\n\n');
      for (const w of ['One ', 'two']) res.write('event: content_block_delta\ndata: ' + JSON.stringify({ type: 'content_block_delta', delta: { type: 'text_delta', text: w } }) + '\n\n');
      res.end('event: message_stop\ndata: {"type":"message_stop"}\n\n');
    });
  });
  try {
    const orig = ai.PROVIDERS.anthropic.base;
    ai.PROVIDERS.anthropic.base = 'http://127.0.0.1:' + srv.address().port;
    const got = await ai.chat({ provider: 'anthropic', base: ai.PROVIDERS.anthropic.base, model: 'claude-x' }, 'k1', { system: 'SYS', messages: [{ role: 'user', content: 'hi' }], onToken() {} });
    ai.PROVIDERS.anthropic.base = orig;
    assert.equal(got, 'One two');
    assert.equal(seen.url, '/v1/messages');
    assert.equal(seen.key, 'k1');
    assert.equal(seen.ver, '2023-06-01');
    assert.equal(seen.body.system, 'SYS');
    assert.ok(seen.body.max_tokens > 0);
  } finally { srv.close(); }
});
