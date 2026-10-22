// Papyrus is generated from Light (scripts/papyrus.js). These keep it so:
// the checked-in blocks match what the generator makes now, and the tint is the parchment's.

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { tintColors, generate } = require('./papyrus.js');

const root = path.join(__dirname, '..');

test('white becomes the parchment, black stays black, alpha is kept', () => {
  assert.equal(tintColors('color: #fff'), 'color: #f6edd3');
  assert.equal(tintColors('color: #000'), 'color: #000000');
  assert.equal(tintColors('background: #ffffff80'), 'background: #f6edd380');
  assert.equal(tintColors('box-shadow: 0 1px 2px rgba(255,255,255,0.5)'), 'box-shadow: 0 1px 2px rgba(246, 237, 211,0.5)');
  assert.equal(tintColors('width: 10px'), 'width: 10px');
});

test('a Light rule gets a Papyrus copy; other rules and @-blocks do not', () => {
  const rules = generate('.a { color: #fff }\nbody.light .b, body.light.bright .c { color: #ccc; margin: 0 }\n@media (max-width: 600px) { body.light .d { color: #fff } }');
  assert.deepEqual(rules, ['body.papyrus .b, body.papyrus.bright .c { color: #c5bea9; margin: 0 }']);
});

test('the generated blocks in styles.css and pocket.css are current', () => {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, [path.join(__dirname, 'papyrus.js'), '--check'], { cwd: root, encoding: 'utf8' });
  assert.equal(r.status, 0, 'run `node scripts/papyrus.js` and keep the result: ' + r.stdout);
  for (const f of ['styles.css', 'pocket/www/pocket.css']) {
    assert.match(fs.readFileSync(path.join(root, f), 'utf8'), /PAPYRUS:BEGIN[\s\S]+PAPYRUS:END/);
  }
});
