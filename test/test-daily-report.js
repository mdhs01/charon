import test from 'node:test';
import assert from 'node:assert/strict';
import { initDb, db } from '../src/db/connection.js';
import { buildDailyReport } from '../src/shared/daily-report.js';

initDb();

test('daily report contains key sections and uses local history window', () => {
  db.prepare('DELETE FROM dry_run_positions').run();
  const now = Date.now();
  db.prepare("INSERT INTO dry_run_positions (mint, symbol, status, opened_at_ms, closed_at_ms, size_sol, tp_percent, sl_percent, trailing_enabled, trailing_percent, strategy_id, snapshot_json, execution_mode, pnl_sol) VALUES ('a','A','closed',?,?,0.1,50,-20,1,10,'sniper','{}','dry_run',0.5)").run(now-3600000, now-1800000);
  db.prepare("INSERT INTO dry_run_positions (mint, symbol, status, opened_at_ms, closed_at_ms, size_sol, tp_percent, sl_percent, trailing_enabled, trailing_percent, strategy_id, snapshot_json, execution_mode, pnl_sol) VALUES ('b','B','closed',?,?,0.1,50,-20,1,10,'sniper','{}','dry_run',-0.2)").run(now-3600000, now-1200000);
  const { report, health } = buildDailyReport({ lookbackHours: 24 });
  assert.ok(report.includes('<b>Equity</b>'));
  assert.ok(report.includes('<b>Trades</b>'));
  assert.ok(report.includes('<b>Open Positions</b>'));
  assert.equal(health.closedTrades, 2);
});
