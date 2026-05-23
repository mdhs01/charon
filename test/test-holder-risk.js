import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHolderRisk } from '../src/shared/holder-risk.js';

const nowMs = Date.now();

function holder(i, extra = {}) {
  return { address: `wallet_${i}`, ...extra };
}

test('returns checked=false when holder meta is missing', () => {
  const res = evaluateHolderRisk({ holders: { top20: [holder(1), holder(2)] } }, nowMs);
  assert.equal(res.checked, false);
});

test('detects severe holder cluster and hard reject', () => {
  const top20 = Array.from({ length: 8 }).map((_, i) => holder(i, {
    fundedAtMs: nowMs - 2 * 3600_000,
    solBalance: 0.05,
    fundingSource: 'same_funder',
    buyAtMs: nowMs + i * 1000,
  }));
  const res = evaluateHolderRisk({ holders: { top20 } }, nowMs);
  assert.equal(res.checked, true);
  assert.equal(res.hardReject, true);
  assert.ok(res.riskFlags.includes('fresh_funded_holders_above_max'));
  assert.ok(res.riskFlags.includes('holder_cluster_risk_above_max'));
});
