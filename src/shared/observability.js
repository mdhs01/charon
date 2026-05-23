import { now } from '../utils.js';

export function buildObservability(candidate, { source = 'unknown', entryMode = 'immediate', strategyTier = null } = {}) {
  const metrics = candidate?.metrics || {};
  const trending = candidate?.trending || {};
  const holders = candidate?.holders || {};
  const top10Rate = Number(holders?.top10HolderRate ?? holders?.top10_rate ?? 0);
  const bundlerRate = Number(trending?.bundler_rate ?? 0);
  const volume = Number(metrics.trendingVolumeUsd ?? metrics.graduatedVolumeUsd ?? 0);
  const feePaid = Number(metrics.gmgnTradeFeesSol ?? metrics.gmgnTotalFeesSol ?? 0);
  return {
    source,
    detectedAtMs: Number(candidate?.createdAtMs || now()),
    openedAt: null,
    exitAgeMs: null,
    entryMarketCap: Number(metrics.marketCapUsd ?? 0),
    currentMarketCap: Number(metrics.marketCapUsd ?? 0),
    liquidity: Number(metrics.liquidityUsd ?? 0),
    volume,
    feePaid,
    volumeFeeRatio: feePaid > 0 ? volume / feePaid : null,
    volumeFeeHealth: Number(candidate?.risk?.volumeFeeRisk?.volumeFeeHealth ?? 0),
    feeRateEstimate: Number(metrics.feeRateEstimate ?? candidate?.risk?.volumeFeeRisk?.feeRateEstimate ?? 0),
    top10Rate: Number.isFinite(top10Rate) ? top10Rate : 0,
    bundlerRate: Number.isFinite(bundlerRate) ? bundlerRate : 0,
    insiderRate: Number(trending?.insider_rate ?? 0),
    sniperHoldRate: Number(trending?.sniper_hold_rate ?? 0),
    holderCount: Number(metrics.holderCount ?? 0),
    freshFundedHolderCount: Number(candidate?.savedWalletExposure?.holderCount ?? 0),
    freshFundedTopHolderRate: Number(candidate?.savedWalletExposure?.topHolderPercent ?? 0),
    holderClusterRiskScore: Number(candidate?.risk?.holderRisk?.holderClusterRiskScore ?? 0),
    lowTopHolderSolBalanceCount: Number(candidate?.risk?.holderRisk?.lowTopHolderSolBalanceCount ?? 0),
    authorityRisk: candidate?.risk?.authorityRisk ?? null,
    networkFeePctl: Number(candidate?.risk?.networkCongestion?.p95Microlamports ?? candidate?.risk?.networkFeePctl ?? 0),
    networkCongestionScore: Number(candidate?.risk?.networkCongestion?.networkCongestionScore ?? 0),
    networkCongestionLevel: candidate?.risk?.networkCongestion?.level ?? null,
    walletAlphaConfirmations: Number(candidate?.risk?.walletAlpha?.confirmations ?? 0),
    walletAlphaBoost: Number(candidate?.risk?.walletAlpha?.boost ?? 0),
    strategyTier: strategyTier || candidate?.strategyTier?.tier || candidate?.signals?.strategy || 'default',
    tierConfig: candidate?.tierConfig || null,
    entryMode: candidate?.entryMode || entryMode,
  };
}

export function withOpenPositionObservability(observability, openedAtMs, entryMarketCap) {
  return {
    ...observability,
    openedAt: new Date(openedAtMs).toISOString(),
    detectedAtMs: Number(observability?.detectedAtMs || openedAtMs),
    entryMarketCap: Number(entryMarketCap ?? observability?.entryMarketCap ?? 0),
    currentMarketCap: Number(entryMarketCap ?? observability?.currentMarketCap ?? 0),
  };
}

export function withExitObservability(observability, { openedAtMs, closedAtMs, currentMarketCap }) {
  return {
    ...observability,
    currentMarketCap: Number(currentMarketCap ?? observability?.currentMarketCap ?? 0),
    exitAgeMs: openedAtMs && closedAtMs ? Math.max(0, Number(closedAtMs) - Number(openedAtMs)) : null,
  };
}
