import { db } from '../db/connection.js';
import { ENABLE_PROFIT_RESERVE, PROFIT_RESERVE_PCT } from '../config.js';

export function dryRunCapitalSummary() {
  const rows = db.prepare("SELECT pnl_sol, status, execution_mode FROM dry_run_positions WHERE COALESCE(execution_mode,'dry_run')='dry_run'").all();
  const realizedProfitSol = rows.filter(r => r.status === 'closed').reduce((s, r) => s + Number(r.pnl_sol || 0), 0);
  const positiveProfitSol = rows.filter(r => r.status === 'closed').reduce((s, r) => s + Math.max(0, Number(r.pnl_sol || 0)), 0);
  const reservedProfitSol = ENABLE_PROFIT_RESERVE ? positiveProfitSol * (Number(PROFIT_RESERVE_PCT || 35) / 100) : 0;
  const deployableBalanceSol = realizedProfitSol - reservedProfitSol;
  return {
    enabled: ENABLE_PROFIT_RESERVE,
    reservePct: Number(PROFIT_RESERVE_PCT || 35),
    realizedProfitSol,
    positiveProfitSol,
    reservedProfitSol,
    deployableBalanceSol,
    note: ENABLE_PROFIT_RESERVE ? 'virtual reserve only; no transfer is executed' : 'reserve disabled',
  };
}
