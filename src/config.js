import dotenv from 'dotenv';

dotenv.config();

export const APP_NAME = 'Charon';
export const DB_PATH = process.env.DB_PATH || './charon.sqlite';
export const PUMP_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
export const PUMP_AMM = 'pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA';
export const DISC_DIST_FEES = Buffer.from('a537817004b3ca28', 'hex');
export const WSOL_MINT = 'So11111111111111111111111111111111111111112';
export const SOL_MINT = 'So11111111111111111111111111111111111111111';

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
export const TELEGRAM_TOPIC_ID = process.env.TELEGRAM_TOPIC_ID;
export const HELIUS_API_KEY = process.env.HELIUS_API_KEY;
export const GMGN_API_KEY = process.env.GMGN_API_KEY;
export const GMGN_ENABLED = process.env.GMGN_ENABLED !== 'false';
export const JUPITER_API_KEY = process.env.JUPITER_API_KEY || '';
export const SOLANA_PRIVATE_KEY = process.env.SOLANA_PRIVATE_KEY || process.env.PRIVATE_KEY || '';
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const SOLANA_WS_URL = process.env.SOLANA_WS_URL || `wss://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
export const JUPITER_SWAP_BASE_URL = process.env.JUPITER_SWAP_BASE_URL || 'https://api.jup.ag/swap/v2';
export const JUPITER_SLIPPAGE_BPS = Number(process.env.JUPITER_SLIPPAGE_BPS || 300);
export const LIVE_MIN_SOL_RESERVE_LAMPORTS = Math.floor(Number(process.env.LIVE_MIN_SOL_RESERVE || 0.02) * 1_000_000_000);
export const LLM_BASE_URL = process.env.LLM_BASE_URL || 'https://api.minimax.io/v1';
export const LLM_API_KEY = process.env.LLM_API_KEY || '';
export const LLM_MODEL = process.env.LLM_MODEL || 'MiniMax-M2.7';

export const GRADUATED_POLL_MS = Number(process.env.GRADUATED_POLL_MS || 30_000);
export const GRADUATED_LOOKBACK_MS = Number(process.env.GRADUATED_LOOKBACK_MS || 2 * 60 * 60 * 1000);
export const TRENDING_POLL_MS = Number(process.env.TRENDING_POLL_MS || 60_000);
export const TRENDING_LOOKBACK_MS = Number(process.env.TRENDING_LOOKBACK_MS || 10 * 60 * 1000);
export const GMGN_CACHE_TTL_MS = Number(process.env.GMGN_CACHE_TTL_MS || 5 * 60 * 1000);
export const POSITION_CHECK_MS = Number(process.env.POSITION_CHECK_MS || 10_000);
export const LLM_TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS || 60_000);
export const ENABLE_LLM = process.env.ENABLE_LLM !== 'false';
export const SIGNAL_SERVER_URL = process.env.SIGNAL_SERVER_URL || 'http://localhost:3456';
export const SIGNAL_SERVER_KEY = process.env.SIGNAL_SERVER_KEY || '';
export const SIGNAL_POLL_MS = Number(process.env.SIGNAL_POLL_MS || 30_000);

export const ENABLE_TOKEN_AUTHORITY_GUARD = process.env.ENABLE_TOKEN_AUTHORITY_GUARD !== 'false';
export const REJECT_ACTIVE_MINT_AUTHORITY = process.env.REJECT_ACTIVE_MINT_AUTHORITY !== 'false';
export const ACTIVE_FREEZE_AUTHORITY_SCORE_PENALTY = Number(process.env.ACTIVE_FREEZE_AUTHORITY_SCORE_PENALTY || 0.12);

export const ENABLE_HOLDER_FUNDING_RISK = process.env.ENABLE_HOLDER_FUNDING_RISK !== 'false';
export const FRESH_FUNDED_WALLET_MAX_AGE_HOURS = Number(process.env.FRESH_FUNDED_WALLET_MAX_AGE_HOURS || 24);
export const MIN_FRESH_FUNDED_HOLDER_COUNT_TO_PENALIZE = Number(process.env.MIN_FRESH_FUNDED_HOLDER_COUNT_TO_PENALIZE || 3);
export const MIN_FRESH_FUNDED_HOLDER_COUNT_TO_REJECT = Number(process.env.MIN_FRESH_FUNDED_HOLDER_COUNT_TO_REJECT || 6);
export const LOW_TOP_HOLDER_SOL_BALANCE = Number(process.env.LOW_TOP_HOLDER_SOL_BALANCE || 0.2);
export const HOLDER_CLUSTER_SCORE_REJECT = Number(process.env.HOLDER_CLUSTER_SCORE_REJECT || 0.75);
export const HOLDER_CLUSTER_SCORE_PENALTY = Number(process.env.HOLDER_CLUSTER_SCORE_PENALTY || 0.12);

export const ENABLE_VOLUME_FEE_CHECK = process.env.ENABLE_VOLUME_FEE_CHECK !== 'false';
export const VOLUME_FEE_MIN_HEALTH = Number(process.env.VOLUME_FEE_MIN_HEALTH || 0.35);
export const VOLUME_FEE_REJECT_HEALTH = Number(process.env.VOLUME_FEE_REJECT_HEALTH || 0.15);
export const DEFAULT_POOL_FEE_RATE = Number(process.env.DEFAULT_POOL_FEE_RATE || 0.0025);
export const VOLUME_FEE_SCORE_PENALTY = Number(process.env.VOLUME_FEE_SCORE_PENALTY || 0.1);

export const ENABLE_NETWORK_CONGESTION_GUARD = process.env.ENABLE_NETWORK_CONGESTION_GUARD !== 'false';
export const NETWORK_FEE_SKIP_MICROLAMPORTS = Number(process.env.NETWORK_FEE_SKIP_MICROLAMPORTS || 150000);
export const NETWORK_CONGESTION_SIZE_MULTIPLIER = Number(process.env.NETWORK_CONGESTION_SIZE_MULTIPLIER || 0.5);

export const ENABLE_MARKET_CAP_TIERS = process.env.ENABLE_MARKET_CAP_TIERS !== 'false';
export const NEW_PAIR_MAX_MCAP = Number(process.env.NEW_PAIR_MAX_MCAP || 100000);
export const MICRO_CAP_MAX_MCAP = Number(process.env.MICRO_CAP_MAX_MCAP || 5000000);
export const MID_CAP_MAX_MCAP = Number(process.env.MID_CAP_MAX_MCAP || 50000000);
export const REJECT_HIGH_CAP = process.env.REJECT_HIGH_CAP !== 'false';
export const NEW_PAIR_SIZE_MULTIPLIER = Number(process.env.NEW_PAIR_SIZE_MULTIPLIER || 0.5);
export const MICRO_CAP_SIZE_MULTIPLIER = Number(process.env.MICRO_CAP_SIZE_MULTIPLIER || 1);
export const MID_CAP_SIZE_MULTIPLIER = Number(process.env.MID_CAP_SIZE_MULTIPLIER || 0.75);
export const HIGH_CAP_SIZE_MULTIPLIER = Number(process.env.HIGH_CAP_SIZE_MULTIPLIER || 0.25);
export const NEW_PAIR_TIMED_EXIT_MINUTES = Number(process.env.NEW_PAIR_TIMED_EXIT_MINUTES || 4);
export const NEW_PAIR_TIMED_EXIT_GRACE_MINUTES = Number(process.env.NEW_PAIR_TIMED_EXIT_GRACE_MINUTES || 8);
export const NEW_PAIR_HARD_SL_PCT = Number(process.env.NEW_PAIR_HARD_SL_PCT || 18);
export const NEW_PAIR_TP1_PCT = Number(process.env.NEW_PAIR_TP1_PCT || 25);
export const NEW_PAIR_TP2_PCT = Number(process.env.NEW_PAIR_TP2_PCT || 80);
export const NEW_PAIR_TRAILING_STOP_PCT = Number(process.env.NEW_PAIR_TRAILING_STOP_PCT || 12);
export const MICRO_CAP_TIMED_EXIT_MINUTES = Number(process.env.MICRO_CAP_TIMED_EXIT_MINUTES || 5);
export const MICRO_CAP_TIMED_EXIT_GRACE_MINUTES = Number(process.env.MICRO_CAP_TIMED_EXIT_GRACE_MINUTES || 12);
export const MICRO_CAP_HARD_SL_PCT = Number(process.env.MICRO_CAP_HARD_SL_PCT || 20);
export const MICRO_CAP_TP1_PCT = Number(process.env.MICRO_CAP_TP1_PCT || 30);
export const MICRO_CAP_TP2_PCT = Number(process.env.MICRO_CAP_TP2_PCT || 100);
export const MICRO_CAP_TRAILING_STOP_PCT = Number(process.env.MICRO_CAP_TRAILING_STOP_PCT || 10);
export const MID_CAP_TIMED_EXIT_MINUTES = Number(process.env.MID_CAP_TIMED_EXIT_MINUTES || 10);
export const MID_CAP_TIMED_EXIT_GRACE_MINUTES = Number(process.env.MID_CAP_TIMED_EXIT_GRACE_MINUTES || 20);
export const MID_CAP_TIMED_EXIT_PROFIT_THRESHOLD_PCT = Number(process.env.MID_CAP_TIMED_EXIT_PROFIT_THRESHOLD_PCT || 3);
export const MID_CAP_TIMED_EXIT_MAX_LOSS_PCT = Number(process.env.MID_CAP_TIMED_EXIT_MAX_LOSS_PCT || 5);
export const MID_CAP_HARD_SL_PCT = Number(process.env.MID_CAP_HARD_SL_PCT || 12);
export const MID_CAP_TP1_PCT = Number(process.env.MID_CAP_TP1_PCT || 18);
export const MID_CAP_TP2_PCT = Number(process.env.MID_CAP_TP2_PCT || 45);
export const MID_CAP_TRAILING_STOP_PCT = Number(process.env.MID_CAP_TRAILING_STOP_PCT || 6);

export const ENABLE_PROBE_ENTRY = process.env.ENABLE_PROBE_ENTRY === 'true';
export const PROBE_ENTRY_PCT = Number(process.env.PROBE_ENTRY_PCT || 20);
export const PROBE_CONFIRM_MIN_PNL_PCT = Number(process.env.PROBE_CONFIRM_MIN_PNL_PCT || 3);
export const PROBE_CONFIRM_MAX_AGE_MINUTES = Number(process.env.PROBE_CONFIRM_MAX_AGE_MINUTES || 4);
export const PROBE_FAIL_EXIT_PCT = Number(process.env.PROBE_FAIL_EXIT_PCT || -7);

export const ENABLE_WALLET_ALPHA = process.env.ENABLE_WALLET_ALPHA === 'true';
export const WALLET_ALPHA_MIN_SCORE = Number(process.env.WALLET_ALPHA_MIN_SCORE || 0.65);
export const WALLET_ALPHA_MIN_CONFIRMATIONS = Number(process.env.WALLET_ALPHA_MIN_CONFIRMATIONS || 2);
export const WALLET_ALPHA_WINDOW_SECONDS = Number(process.env.WALLET_ALPHA_WINDOW_SECONDS || 90);
export const WALLET_ALPHA_SCORE_BOOST = Number(process.env.WALLET_ALPHA_SCORE_BOOST || 0.08);

export const ENABLE_PROFIT_RESERVE = process.env.ENABLE_PROFIT_RESERVE === 'true';
export const PROFIT_RESERVE_PCT = Number(process.env.PROFIT_RESERVE_PCT || 35);

export const ENABLE_DAILY_REPORT = process.env.ENABLE_DAILY_REPORT !== 'false';
export const DAILY_REPORT_CRON = process.env.DAILY_REPORT_CRON || '0 7 * * *';
export const DAILY_REPORT_TIMEZONE = process.env.DAILY_REPORT_TIMEZONE || 'Asia/Jakarta';
export const DAILY_REPORT_LOOKBACK_HOURS = Number(process.env.DAILY_REPORT_LOOKBACK_HOURS || 24);

export const JSON_HEADERS = {
  Accept: 'application/json, text/plain, */*',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
};

export function validateConfig() {
  if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is required.');
  if (!TELEGRAM_CHAT_ID) throw new Error('TELEGRAM_CHAT_ID is required.');
  if (!HELIUS_API_KEY && (!process.env.SOLANA_RPC_URL || !process.env.SOLANA_WS_URL)) {
    throw new Error('HELIUS_API_KEY is required unless SOLANA_RPC_URL and SOLANA_WS_URL are set.');
  }
  if (GMGN_ENABLED && !GMGN_API_KEY) throw new Error('GMGN_API_KEY is required unless GMGN_ENABLED=false.');
}
