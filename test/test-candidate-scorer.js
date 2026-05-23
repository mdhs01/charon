import { initDb } from '../src/db/connection.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCandidate } from '../src/pipeline/candidateBuilder.js';

function makeCandidate(risk, holderRisk = { checked: false }) {
  return {
    metrics: { marketCapUsd: 10000, gmgnTotalFeesSol: 0, gmgnTradeFeesSol: 0, feeRateEstimate: 0.0025, graduatedVolumeUsd: 0, trendingVolumeUsd: 0, holderCount: 100 },
    holders: { maxHolderPercent: 5 },
    savedWalletExposure: { holderCount: 0 },
    trending: null,
    feeClaim: null,
    graduation: null,
    gmgn: null,
    chart: {},
    risk: { authorityRisk: risk, holderRisk, networkCongestion: { checked: false } },
    strategyTier: { rejected: false, tierConfig: { sizeMultiplier: 1 } },
    signals: { route: 'graduated' },
  };
}

initDb();

test('active mint authority is hard rejected when guard active', () => {
  const result = filterCandidate(makeCandidate({ checkOk: true, hasActiveMintAuthority: true, hasActiveFreezeAuthority: false }));
  assert.equal(result.passed, false);
  assert.ok(result.failures.includes('active_mint_authority'));
});

test('active freeze authority applies score penalty not hard reject', () => {
  const result = filterCandidate(makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: true }));
  assert.equal(result.failures.includes('active_mint_authority'), false);
  assert.ok(Array.isArray(result.scorePenalties));
  assert.ok(result.scorePenalties.some(p => p.key === 'active_freeze_authority'));
});


test('holder cluster severe risk is rejected', () => {
  const result = filterCandidate(makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: false, }, {
    checked: true,
    hardReject: true,
    shouldPenalty: true,
    riskFlags: ['fresh_funded_holders_above_max', 'holder_cluster_risk_above_max', 'holder_cluster_risk'],
  }));
  assert.equal(result.passed, false);
  assert.ok(result.failures.includes('fresh_funded_holders_above_max'));
  assert.ok(result.failures.includes('holder_cluster_risk_above_max'));
});


test('low volume fee health adds reject flag', () => {
  const c = makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: false }, { checked: false });
  c.risk.volumeFeeRisk = { checked: true, hardReject: true, shouldPenalty: true, volumeFeeHealth: 0.05 };
  const result = filterCandidate(c);
  assert.equal(result.passed, false);
  assert.ok(result.failures.includes('volume_fee_health_below_reject'));
  assert.ok(result.scorePenalties.some(p => p.key === 'low_volume_fee_health'));
});


test('extreme network congestion skips fresh launch trending candidates', () => {
  const c = makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: false }, { checked: false });
  c.signals = { route: 'trending' };
  c.risk.networkCongestion = { checked: true, action: 'skip_fresh_launch', level: 'extreme', sizeMultiplier: 0 };
  const result = filterCandidate(c);
  assert.equal(result.passed, false);
  assert.ok(result.failures.includes('network_congestion_fresh_launch_skip'));
  assert.equal(result.suggestedSizeMultiplier, 0);
});


test('high cap tier rejected by strategy tier guard', () => {
  const c = makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: false }, { checked: false });
  c.strategyTier = { rejected: true, tierConfig: { sizeMultiplier: 0.25 } };
  const result = filterCandidate(c);
  assert.equal(result.passed, false);
  assert.ok(result.failures.includes('strategy_tier_rejected'));
});


test('wallet alpha confirmation adds boost reason only when valid', () => {
  const c = makeCandidate({ checkOk: true, hasActiveMintAuthority: false, hasActiveFreezeAuthority: false }, { checked: false });
  c.risk.walletAlpha = { enabled: true, confirmed: true, confirmations: 2, boost: 0.08 };
  const result = filterCandidate(c);
  assert.ok(result.scorePenalties.some(p => p.key === 'wallet_alpha_confirmation'));
});
