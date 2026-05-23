import { Connection } from '@solana/web3.js';
import { SOLANA_RPC_URL, ENABLE_NETWORK_CONGESTION_GUARD, NETWORK_FEE_SKIP_MICROLAMPORTS, NETWORK_CONGESTION_SIZE_MULTIPLIER } from '../config.js';

function percentile(values, p) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const i = Math.min(sorted.length - 1, Math.max(0, Math.floor((p / 100) * (sorted.length - 1))));
  return sorted[i];
}

export async function readNetworkCongestion({ connection = null } = {}) {
  if (!ENABLE_NETWORK_CONGESTION_GUARD) return { checked: false, reason: 'disabled' };
  const conn = connection || new Connection(SOLANA_RPC_URL, 'confirmed');
  const fees = await conn.getRecentPrioritizationFees().catch(() => []);
  const samples = (fees || []).map(f => Number(f.prioritizationFee || 0)).filter(Number.isFinite).filter(v => v > 0);
  if (!samples.length) return { checked: false, reason: 'no_fee_samples' };

  const p50 = percentile(samples, 50);
  const p90 = percentile(samples, 90);
  const p95 = percentile(samples, 95);
  const current = samples[samples.length - 1] || p90;
  const networkCongestionScore = Math.max(0, Math.min(1, p95 > 0 ? current / p95 : 0));
  const extreme = current >= NETWORK_FEE_SKIP_MICROLAMPORTS;
  const level = extreme ? 'extreme' : (networkCongestionScore >= 0.7 ? 'high' : networkCongestionScore >= 0.35 ? 'medium' : 'low');
  return {
    checked: true,
    currentMicrolamports: current,
    p50Microlamports: p50,
    p90Microlamports: p90,
    p95Microlamports: p95,
    networkCongestionScore,
    level,
    action: extreme ? 'skip_fresh_launch' : (level === 'high' ? 'reduce_size' : 'normal'),
    sizeMultiplier: extreme ? 0 : (level === 'high' ? NETWORK_CONGESTION_SIZE_MULTIPLIER : 1),
  };
}
