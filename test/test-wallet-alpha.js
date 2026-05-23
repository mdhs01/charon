import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { walletAlphaConfirmation, updateWalletAlphaFromPosition } from '../src/shared/wallet-alpha.js';

const dbPath = 'data/wallet_alpha.json';
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

test('wallet alpha defaults disabled (no auto impact)', () => {
  fs.writeFileSync(dbPath, JSON.stringify({ wallets: { a: { wins: 5, losses: 1, earlyWins: 3, quickDumps: 0 } } }));
  const c = { holders: { top20: [{ address: 'a', buyAtMs: Date.now() }] } };
  const res = walletAlphaConfirmation(c);
  assert.equal(res.enabled, false);
  assert.equal(res.confirmed, false);
});

test('wallet alpha db updates from local outcome', () => {
  fs.writeFileSync(dbPath, JSON.stringify({ wallets: {} }));
  const out = updateWalletAlphaFromPosition({ candidate: { holders: { top20: [{ address: 'w1' }] } } }, { won: true, early: true });
  assert.ok(out.wallets.w1);
  assert.equal(out.wallets.w1.wins, 1);
});
