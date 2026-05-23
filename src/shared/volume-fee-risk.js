import {
  ENABLE_VOLUME_FEE_CHECK,
  VOLUME_FEE_MIN_HEALTH,
  VOLUME_FEE_REJECT_HEALTH,
  DEFAULT_POOL_FEE_RATE,
} from '../config.js';

export function evaluateVolumeFeeRisk(candidate) {
  if (!ENABLE_VOLUME_FEE_CHECK) return { checked: false, reason: 'disabled' };

  const volumeUsd = Number(candidate?.metrics?.trendingVolumeUsd ?? candidate?.metrics?.graduatedVolumeUsd ?? 0);
  const feesPaid = Number(candidate?.metrics?.gmgnTradeFeesSol ?? candidate?.metrics?.gmgnTotalFeesSol ?? NaN);
  const feeRateEstimate = Number(candidate?.metrics?.feeRateEstimate ?? DEFAULT_POOL_FEE_RATE);

  if (!Number.isFinite(volumeUsd) || volumeUsd <= 0) return { checked: false, reason: 'no_volume' };
  if (!Number.isFinite(feesPaid) || feesPaid <= 0) return { checked: false, reason: 'unknown_fee' };
  if (!Number.isFinite(feeRateEstimate) || feeRateEstimate <= 0) return { checked: false, reason: 'bad_fee_rate' };

  const expectedFee = volumeUsd * feeRateEstimate;
  if (!Number.isFinite(expectedFee) || expectedFee <= 0) return { checked: false, reason: 'bad_expected_fee' };

  const volumeFeeHealth = feesPaid / expectedFee;
  return {
    checked: true,
    volumeUsd,
    feesPaid,
    feeRateEstimate,
    expectedFee,
    volumeFeeHealth,
    shouldPenalty: volumeFeeHealth < VOLUME_FEE_MIN_HEALTH,
    hardReject: volumeFeeHealth < VOLUME_FEE_REJECT_HEALTH,
    riskFlags: [
      volumeFeeHealth < VOLUME_FEE_REJECT_HEALTH ? 'volume_fee_health_below_reject' : null,
      volumeFeeHealth < VOLUME_FEE_MIN_HEALTH ? 'low_volume_fee_health' : null,
    ].filter(Boolean),
  };
}
