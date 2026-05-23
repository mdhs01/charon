import { Connection, PublicKey } from '@solana/web3.js';
import { SOLANA_RPC_URL } from '../config.js';

const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const TOKEN_2022_PROGRAM_ID = 'TokenzQdBNbLqP5VEh9UpAJZciVYj6A4hS9M4nQw4o';

function readPubkeyAt(data, offset) {
  const option = data.readUInt32LE(offset);
  if (option === 0) return null;
  return new PublicKey(data.subarray(offset + 4, offset + 36)).toBase58();
}

export function parseMintAuthority(data) {
  if (!Buffer.isBuffer(data) || data.length < 82) {
    throw new Error('Invalid mint account data');
  }
  const mintAuthority = readPubkeyAt(data, 0);
  const freezeAuthority = readPubkeyAt(data, 46);
  return {
    mintAuthority,
    freezeAuthority,
    hasActiveMintAuthority: Boolean(mintAuthority),
    hasActiveFreezeAuthority: Boolean(freezeAuthority),
  };
}

export async function readTokenAuthority(mint, { connection = null } = {}) {
  const conn = connection || new Connection(SOLANA_RPC_URL, 'confirmed');
  const key = new PublicKey(mint);
  const account = await conn.getAccountInfo(key, 'confirmed');
  if (!account) return { ok: false, error: 'mint_account_not_found' };
  const owner = account.owner?.toBase58?.() || String(account.owner || '');
  if (owner !== TOKEN_PROGRAM_ID && owner !== TOKEN_2022_PROGRAM_ID) {
    return { ok: false, error: 'unsupported_owner_program', ownerProgram: owner };
  }
  const parsed = parseMintAuthority(Buffer.from(account.data));
  return {
    ok: true,
    ownerProgram: owner === TOKEN_2022_PROGRAM_ID ? 'token_2022' : 'token',
    ...parsed,
  };
}
