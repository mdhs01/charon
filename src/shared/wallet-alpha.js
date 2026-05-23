import fs from 'node:fs';
import path from 'node:path';
import {
  ENABLE_WALLET_ALPHA,
  WALLET_ALPHA_MIN_SCORE,
  WALLET_ALPHA_MIN_CONFIRMATIONS,
  WALLET_ALPHA_WINDOW_SECONDS,
  WALLET_ALPHA_SCORE_BOOST,
} from '../config.js';

const DB_PATH = path.resolve(process.cwd(), 'data/wallet_alpha.json');

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB_PATH, 'utf8')); } catch { return { wallets: {} }; }
}

function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function walletScore(row) {
  const wins = Number(row?.wins || 0);
  const losses = Number(row?.losses || 0);
  const early = Number(row?.earlyWins || 0);
  const dump = Number(row?.quickDumps || 0);
  const n = wins + losses;
  if (n <= 0) return 0;
  return Math.max(0, Math.min(1, (wins / n) * 0.65 + (early / n) * 0.25 - (dump / n) * 0.2));
}

export function walletAlphaConfirmation(candidate, nowMs = Date.now()) {
  if (!ENABLE_WALLET_ALPHA) return { enabled: false, confirmed: false, confirmations: 0, boost: 0 };
  const db = readDb();
  const holders = candidate?.holders?.top20 || [];
  const maxAgeMs = Number(WALLET_ALPHA_WINDOW_SECONDS) * 1000;
  const confirmed = [];
  for (const h of holders) {
    const w = db.wallets?.[h.address];
    if (!w) continue;
    const score = walletScore(w);
    const seenAge = Number.isFinite(Number(h.buyAtMs)) ? nowMs - Number(h.buyAtMs) : null;
    if (score >= WALLET_ALPHA_MIN_SCORE && (seenAge === null || seenAge <= maxAgeMs)) confirmed.push({ address: h.address, score });
  }
  const confirmations = confirmed.length;
  const valid = confirmations >= WALLET_ALPHA_MIN_CONFIRMATIONS;
  return {
    enabled: true,
    confirmed: valid,
    confirmations,
    boost: valid ? WALLET_ALPHA_SCORE_BOOST : 0,
    wallets: confirmed,
    minConfirmations: WALLET_ALPHA_MIN_CONFIRMATIONS,
    windowSeconds: WALLET_ALPHA_WINDOW_SECONDS,
  };
}

export function updateWalletAlphaFromPosition(position, { won = false, early = false, quickDump = false } = {}) {
  const db = readDb();
  const wallets = position?.candidate?.holders?.top20?.map(h => h.address).filter(Boolean) || [];
  for (const addr of wallets) {
    const row = db.wallets[addr] || { wins: 0, losses: 0, earlyWins: 0, quickDumps: 0, updatedAtMs: 0 };
    if (won) row.wins += 1; else row.losses += 1;
    if (early && won) row.earlyWins += 1;
    if (quickDump) row.quickDumps += 1;
    row.updatedAtMs = Date.now();
    row.score = walletScore(row);
    db.wallets[addr] = row;
  }
  writeDb(db);
  return db;
}
