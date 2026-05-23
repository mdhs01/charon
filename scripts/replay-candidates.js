#!/usr/bin/env node
import { db } from '../src/db/connection.js';
import { safeJson } from '../src/utils.js';

const FIELDS = [
  'source','detectedAtMs','openedAt','exitAgeMs','entryMarketCap','currentMarketCap','liquidity','volume','feePaid','volumeFeeRatio','volumeFeeHealth','feeRateEstimate','top10Rate','bundlerRate','insiderRate','sniperHoldRate','holderCount','freshFundedHolderCount','freshFundedTopHolderRate','holderClusterRiskScore','lowTopHolderSolBalanceCount','authorityRisk','networkFeePctl','networkCongestionScore','networkCongestionLevel','walletAlphaConfirmations','walletAlphaBoost','strategyTier','tierConfig','entryMode',
];

const hasCandidates = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='candidates'").get();
if (!hasCandidates) {
  console.log('=== Replay Candidates (dry-run only, no buy execution) ===');
  console.log('Rows: 0');
  console.log('Candidates table is not initialized yet.');
  process.exit(0);
}
const rows = db.prepare('SELECT id, status, candidate_json, filter_result_json FROM candidates ORDER BY id DESC LIMIT 1000').all();
let withObs = 0;
const coverage = Object.fromEntries(FIELDS.map(k => [k, 0]));
const strategyTier = {};
const entryMode = {};
const riskFlagCounts = {};
for (const row of rows) {
  const candidate = safeJson(row.candidate_json, {});
  const filters = safeJson(row.filter_result_json, {});
  const obs = candidate.observability || {};
  if (candidate.observability) withObs += 1;
  for (const key of FIELDS) if (obs[key] !== undefined && obs[key] !== null) coverage[key] += 1;
  if (obs.strategyTier) strategyTier[obs.strategyTier] = (strategyTier[obs.strategyTier] || 0) + 1;
  if (obs.entryMode) entryMode[obs.entryMode] = (entryMode[obs.entryMode] || 0) + 1;
  for (const fail of (filters.failures || [])) riskFlagCounts[fail] = (riskFlagCounts[fail] || 0) + 1;
}

console.log('=== Replay Candidates (dry-run only, no buy execution) ===');
console.log(`Rows: ${rows.length}`);
console.log(`With observability: ${withObs}`);
console.log('Field coverage:');
for (const key of FIELDS) console.log(`- ${key}: ${coverage[key]}/${rows.length}`);
console.log('Strategy tier distribution:', strategyTier);
console.log('Entry mode distribution:', entryMode);
console.log('Risk flag counts:', riskFlagCounts);
