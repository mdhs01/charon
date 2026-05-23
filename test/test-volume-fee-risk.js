import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateVolumeFeeRisk } from '../src/shared/volume-fee-risk.js';

test('unknown fee data does not reject', () => {
  const res = evaluateVolumeFeeRisk({ metrics: { trendingVolumeUsd: 100000, gmgnTradeFeesSol: 0, feeRateEstimate: 0.0025 } });
  assert.equal(res.checked, false);
  assert.equal(res.reason, 'unknown_fee');
});

test('high volume + very low fee triggers reject health', () => {
  const res = evaluateVolumeFeeRisk({ metrics: { trendingVolumeUsd: 100000, gmgnTradeFeesSol: 10, feeRateEstimate: 0.0025 } });
  assert.equal(res.checked, true);
  assert.equal(res.hardReject, true);
  assert.ok(res.riskFlags.includes('volume_fee_health_below_reject'));
});
