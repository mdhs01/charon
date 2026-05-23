import test from 'node:test';
import assert from 'node:assert/strict';
import { Keypair, PublicKey } from '@solana/web3.js';
import { parseMintAuthority, readTokenAuthority } from '../src/shared/token-authority.js';

function buildMintData({ mintAuthority = null, freezeAuthority = null } = {}) {
  const b = Buffer.alloc(82);
  if (mintAuthority) {
    b.writeUInt32LE(1, 0);
    Buffer.from(new PublicKey(mintAuthority).toBytes()).copy(b, 4);
  }
  if (freezeAuthority) {
    b.writeUInt32LE(1, 46);
    Buffer.from(new PublicKey(freezeAuthority).toBytes()).copy(b, 50);
  }
  return b;
}

test('parseMintAuthority reads active mint/freeze authorities', () => {
  const mintAuth = Keypair.generate().publicKey.toBase58();
  const freezeAuth = Keypair.generate().publicKey.toBase58();
  const parsed = parseMintAuthority(buildMintData({ mintAuthority: mintAuth, freezeAuthority: freezeAuth }));
  assert.equal(parsed.hasActiveMintAuthority, true);
  assert.equal(parsed.hasActiveFreezeAuthority, true);
  assert.equal(parsed.mintAuthority, mintAuth);
  assert.equal(parsed.freezeAuthority, freezeAuth);
});

test('readTokenAuthority supports mocked RPC account data', async () => {
  const mintAuth = Keypair.generate().publicKey.toBase58();
  const fakeConnection = {
    async getAccountInfo() {
      return {
        owner: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        data: buildMintData({ mintAuthority: mintAuth, freezeAuthority: null }),
      };
    },
  };
  const mint = Keypair.generate().publicKey.toBase58();
  const result = await readTokenAuthority(mint, { connection: fakeConnection });
  assert.equal(result.ok, true);
  assert.equal(result.hasActiveMintAuthority, true);
  assert.equal(result.hasActiveFreezeAuthority, false);
});
