import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveStrategyTier } from '../src/shared/strategy-tier.js';

test('resolves new_pair for trending source', () => {
  const t = resolveStrategyTier({ metrics: { marketCapUsd: 1000000 }, signals: { route: 'trending' } });
  assert.equal(t.tier, 'new_pair');
});

test('resolves high_cap and rejected by default', () => {
  const t = resolveStrategyTier({ metrics: { marketCapUsd: 999999999 }, signals: { route: 'graduated' } });
  assert.equal(t.tier, 'high_cap');
  assert.equal(t.rejected, true);
});
