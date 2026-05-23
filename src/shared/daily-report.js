import { db } from '../db/connection.js';
import { now } from '../utils.js';
import { dryRunCapitalSummary } from './history.js';
import { DAILY_REPORT_LOOKBACK_HOURS } from '../config.js';

export function buildDailyReport({ lookbackHours = DAILY_REPORT_LOOKBACK_HOURS } = {}) {
  const cutoff = now() - Number(lookbackHours) * 3600_000;
  const closed = db.prepare("SELECT * FROM dry_run_positions WHERE status='closed' AND closed_at_ms >= ? ORDER BY closed_at_ms DESC").all(cutoff);
  const open = db.prepare("SELECT * FROM dry_run_positions WHERE status='open' ORDER BY opened_at_ms DESC").all();
  const wins = closed.filter(r => Number(r.pnl_sol || 0) > 0).length;
  const losses = closed.filter(r => Number(r.pnl_sol || 0) < 0).length;
  const pnlSol = closed.reduce((s, r) => s + Number(r.pnl_sol || 0), 0);
  const cap = dryRunCapitalSummary();

  const health = {
    openPositions: open.length,
    closedTrades: closed.length,
    winRate: closed.length ? (wins / closed.length) * 100 : 0,
    dailyPnlSol: pnlSol,
  };

  const report = [
    '🗓️ <b>Daily Bot Report</b>',
    '',
    `<b>Equity</b>`,
    `• Daily realized PnL: <b>${pnlSol.toFixed(4)} SOL</b>`,
    `• Reserved profit (virtual): <b>${Number(cap.reservedProfitSol || 0).toFixed(4)} SOL</b>`,
    `• Deployable balance: <b>${Number(cap.deployableBalanceSol || 0).toFixed(4)} SOL</b>`,
    '',
    '<b>Trades</b>',
    `• Closed (${lookbackHours}h): <b>${closed.length}</b> (W:${wins} / L:${losses})`,
    `• Win rate: <b>${health.winRate.toFixed(1)}%</b>`,
    '',
    '<b>Open Positions</b>',
    `• Open now: <b>${open.length}</b>`,
    '',
    '<b>Risk</b>',
    '• Wallet ping is confirmation-only; no single ping auto-buy.',
    '• No automatic profit transfer / third-party rent-refund interaction.',
    '',
    '<b>Bot Health</b>',
    `• Runtime active at report time: <b>yes</b>`,
    `• Window: last <b>${lookbackHours}h</b>`,
    '',
    '<b>Notes</b>',
    '• Thresholds are hypotheses; validate via replay before tightening.',
  ].join('\n');

  return { report, health, cap };
}
