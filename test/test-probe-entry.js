import test from 'node:test';
import assert from 'node:assert/strict';
import { buildObservability } from '../src/shared/observability.js';

test('observability carries probe entry mode', () => {
  const c = { entryMode: 'probe', metrics: { marketCapUsd: 1000, liquidityUsd: 100, holderCount: 10 } };
  const o = buildObservability(c, { source: 'trending', entryMode: 'full' });
  assert.equal(o.entryMode, 'probe');
});
