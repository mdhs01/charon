import {
  ENABLE_HOLDER_FUNDING_RISK,
  FRESH_FUNDED_WALLET_MAX_AGE_HOURS,
  MIN_FRESH_FUNDED_HOLDER_COUNT_TO_PENALIZE,
  MIN_FRESH_FUNDED_HOLDER_COUNT_TO_REJECT,
  LOW_TOP_HOLDER_SOL_BALANCE,
  HOLDER_CLUSTER_SCORE_REJECT,
  HOLDER_CLUSTER_SCORE_PENALTY,
} from '../config.js';

function ageHours(tsMs, nowMs) {
  if (!Number.isFinite(Number(tsMs))) return null;
  return Math.max(0, (Number(nowMs) - Number(tsMs)) / 3600000);
}

export function evaluateHolderRisk(candidate, nowMs = Date.now()) {
  if (!ENABLE_HOLDER_FUNDING_RISK) return { checked: false, reason: 'disabled' };
  const topHolders = Array.isArray(candidate?.holders?.top20) ? candidate.holders.top20 : [];
  if (!topHolders.length) return { checked: false, reason: 'no_top_holders' };

  const withMeta = topHolders.filter(h => h && (h.fundedAtMs || h.firstSeenAtMs || h.solBalance !== undefined || h.fundingSource || h.buyAtMs));
  if (!withMeta.length) return { checked: false, reason: 'missing_holder_meta' };

  const maxAge = Number(FRESH_FUNDED_WALLET_MAX_AGE_HOURS || 24);
  let freshFundedHolderCount = 0;
  let lowTopHolderSolBalanceCount = 0;
  const fundingSourceCount = new Map();
  const buyTimes = [];

  for (const holder of topHolders) {
    const fundedAtMs = Number(holder.fundedAtMs ?? holder.firstSeenAtMs ?? NaN);
    const hrs = ageHours(fundedAtMs, nowMs);
    if (hrs !== null && hrs <= maxAge) freshFundedHolderCount += 1;

    const sol = Number(holder.solBalance ?? holder.sol_balance ?? NaN);
    if (Number.isFinite(sol) && sol <= LOW_TOP_HOLDER_SOL_BALANCE) lowTopHolderSolBalanceCount += 1;

    const source = holder.fundingSource || holder.funding_source || null;
    if (source) fundingSourceCount.set(source, (fundingSourceCount.get(source) || 0) + 1);

    const buyAt = Number(holder.buyAtMs ?? NaN);
    if (Number.isFinite(buyAt)) buyTimes.push(buyAt);
  }

  const repeatedFundingMax = Math.max(0, ...fundingSourceCount.values());
  buyTimes.sort((a, b) => a - b);
  let nearBuyClusterCount = 0;
  for (let i = 1; i < buyTimes.length; i++) {
    if (buyTimes[i] - buyTimes[i - 1] <= 15_000) nearBuyClusterCount += 1;
  }

  const freshRatio = topHolders.length ? freshFundedHolderCount / topHolders.length : 0;
  const lowBalRatio = topHolders.length ? lowTopHolderSolBalanceCount / topHolders.length : 0;
  const repeatedFundingRatio = topHolders.length ? repeatedFundingMax / topHolders.length : 0;
  const buyClusterRatio = topHolders.length ? nearBuyClusterCount / topHolders.length : 0;

  const holderClusterRiskScore = Math.min(1,
    freshRatio * 0.35 +
    lowBalRatio * 0.15 +
    repeatedFundingRatio * 0.30 +
    buyClusterRatio * 0.20,
  );

  const severeSignals = [
    freshFundedHolderCount >= MIN_FRESH_FUNDED_HOLDER_COUNT_TO_REJECT,
    repeatedFundingRatio >= 0.5,
    buyClusterRatio >= 0.5,
    holderClusterRiskScore >= HOLDER_CLUSTER_SCORE_REJECT,
  ].filter(Boolean).length;

  const hardReject = severeSignals >= 2;
  const shouldPenalty = freshFundedHolderCount >= MIN_FRESH_FUNDED_HOLDER_COUNT_TO_PENALIZE || holderClusterRiskScore >= HOLDER_CLUSTER_SCORE_PENALTY;

  return {
    checked: true,
    freshFundedHolderCount,
    lowTopHolderSolBalanceCount,
    repeatedFundingMax,
    nearBuyClusterCount,
    holderClusterRiskScore,
    hardReject,
    shouldPenalty,
    riskFlags: [
      freshFundedHolderCount >= MIN_FRESH_FUNDED_HOLDER_COUNT_TO_PENALIZE ? 'fresh_funded_holders_above_max' : null,
      holderClusterRiskScore >= HOLDER_CLUSTER_SCORE_REJECT ? 'holder_cluster_risk_above_max' : null,
      shouldPenalty ? 'holder_cluster_risk' : null,
    ].filter(Boolean),
  };
}
