import {
  ENABLE_MARKET_CAP_TIERS,
  NEW_PAIR_MAX_MCAP,
  MICRO_CAP_MAX_MCAP,
  MID_CAP_MAX_MCAP,
  REJECT_HIGH_CAP,
  NEW_PAIR_SIZE_MULTIPLIER,
  MICRO_CAP_SIZE_MULTIPLIER,
  MID_CAP_SIZE_MULTIPLIER,
  HIGH_CAP_SIZE_MULTIPLIER,
  NEW_PAIR_TIMED_EXIT_MINUTES,
  NEW_PAIR_TIMED_EXIT_GRACE_MINUTES,
  NEW_PAIR_HARD_SL_PCT,
  NEW_PAIR_TP1_PCT,
  NEW_PAIR_TP2_PCT,
  NEW_PAIR_TRAILING_STOP_PCT,
  MICRO_CAP_TIMED_EXIT_MINUTES,
  MICRO_CAP_TIMED_EXIT_GRACE_MINUTES,
  MICRO_CAP_HARD_SL_PCT,
  MICRO_CAP_TP1_PCT,
  MICRO_CAP_TP2_PCT,
  MICRO_CAP_TRAILING_STOP_PCT,
  MID_CAP_TIMED_EXIT_MINUTES,
  MID_CAP_TIMED_EXIT_GRACE_MINUTES,
  MID_CAP_TIMED_EXIT_PROFIT_THRESHOLD_PCT,
  MID_CAP_TIMED_EXIT_MAX_LOSS_PCT,
  MID_CAP_HARD_SL_PCT,
  MID_CAP_TP1_PCT,
  MID_CAP_TP2_PCT,
  MID_CAP_TRAILING_STOP_PCT,
} from '../config.js';

function cfg(multiplier, exitConfig) { return { sizeMultiplier: multiplier, exitConfig }; }

export function resolveStrategyTier(candidate) {
  if (!ENABLE_MARKET_CAP_TIERS) return { enabled: false, tier: 'default', entryMode: 'full', rejected: false, tierConfig: cfg(1, {}) };
  const mcap = Number(candidate?.metrics?.marketCapUsd ?? 0);
  const route = String(candidate?.signals?.route || '');
  if (route.includes('trending') || mcap <= NEW_PAIR_MAX_MCAP) {
    return { enabled: true, tier: 'new_pair', entryMode: 'full', rejected: false, tierConfig: cfg(NEW_PAIR_SIZE_MULTIPLIER, {
      timedExitMinutes: NEW_PAIR_TIMED_EXIT_MINUTES, timedExitGraceMinutes: NEW_PAIR_TIMED_EXIT_GRACE_MINUTES,
      hardSlPct: NEW_PAIR_HARD_SL_PCT, tp1Pct: NEW_PAIR_TP1_PCT, tp2Pct: NEW_PAIR_TP2_PCT, trailingStopPct: NEW_PAIR_TRAILING_STOP_PCT,
    }) };
  }
  if (mcap <= MICRO_CAP_MAX_MCAP) return { enabled: true, tier: 'micro_cap', entryMode: 'full', rejected: false, tierConfig: cfg(MICRO_CAP_SIZE_MULTIPLIER, {
    timedExitMinutes: MICRO_CAP_TIMED_EXIT_MINUTES, timedExitGraceMinutes: MICRO_CAP_TIMED_EXIT_GRACE_MINUTES,
    hardSlPct: MICRO_CAP_HARD_SL_PCT, tp1Pct: MICRO_CAP_TP1_PCT, tp2Pct: MICRO_CAP_TP2_PCT, trailingStopPct: MICRO_CAP_TRAILING_STOP_PCT,
  }) };
  if (mcap <= MID_CAP_MAX_MCAP) return { enabled: true, tier: 'mid_cap', entryMode: 'full', rejected: false, tierConfig: cfg(MID_CAP_SIZE_MULTIPLIER, {
    timedExitMinutes: MID_CAP_TIMED_EXIT_MINUTES, timedExitGraceMinutes: MID_CAP_TIMED_EXIT_GRACE_MINUTES,
    timedExitProfitThresholdPct: MID_CAP_TIMED_EXIT_PROFIT_THRESHOLD_PCT, timedExitMaxLossPct: MID_CAP_TIMED_EXIT_MAX_LOSS_PCT,
    hardSlPct: MID_CAP_HARD_SL_PCT, tp1Pct: MID_CAP_TP1_PCT, tp2Pct: MID_CAP_TP2_PCT, trailingStopPct: MID_CAP_TRAILING_STOP_PCT,
  }) };
  return { enabled: true, tier: 'high_cap', entryMode: 'full', rejected: Boolean(REJECT_HIGH_CAP), tierConfig: cfg(HIGH_CAP_SIZE_MULTIPLIER, {}) };
}
