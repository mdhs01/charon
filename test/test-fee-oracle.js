import test from 'node:test';
import assert from 'node:assert/strict';
import { readNetworkCongestion } from '../src/shared/fee-oracle.js';

test('returns checked=false on empty fee samples', async () => {
  const res = await readNetworkCongestion({ connection: { async getRecentPrioritizationFees() { return []; } } });
  assert.equal(res.checked, false);
});

test('detects extreme congestion and skip action', async () => {
  const res = await readNetworkCongestion({
    connection: { async getRecentPrioritizationFees() { return [
      { prioritizationFee: 10_000 }, { prioritizationFee: 40_000 }, { prioritizationFee: 180_000 },
    ]; } },
  });
  assert.equal(res.checked, true);
  assert.equal(res.action, 'skip_fresh_launch');
  assert.equal(res.level, 'extreme');
});
