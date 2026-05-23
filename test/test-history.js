import test from 'node:test';
import assert from 'node:assert/strict';
import { initDb, db } from '../src/db/connection.js';

initDb();

test('history summary works and keeps reserve virtual when disabled', async () => {
  db.prepare('DELETE FROM dry_run_positions').run();
  db.prepare("INSERT INTO dry_run_positions (mint, symbol, status, opened_at_ms, size_sol, tp_percent, sl_percent, trailing_enabled, trailing_percent, strategy_id, snapshot_json, execution_mode, pnl_sol) VALUES ('m1','M1','closed',1,0.1,50,-20,1,10,'sniper','{}','dry_run',1.0)").run();
  db.prepare("INSERT INTO dry_run_positions (mint, symbol, status, opened_at_ms, size_sol, tp_percent, sl_percent, trailing_enabled, trailing_percent, strategy_id, snapshot_json, execution_mode, pnl_sol) VALUES ('m2','M2','closed',1,0.1,50,-20,1,10,'sniper','{}','dry_run',-0.4)").run();
  process.env.ENABLE_PROFIT_RESERVE = 'false';
  const { dryRunCapitalSummary } = await import(`../src/shared/history.js?ts=${Date.now()}`);
  const s = dryRunCapitalSummary();
  assert.equal(s.enabled, false);
  assert.equal(s.reservedProfitSol, 0);
});
