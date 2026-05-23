# Solana Rent Refund Ops (Manual Only)

## Important
- Do **not** automate rent-refund interactions with third-party websites from this bot.
- Always verify destination addresses and transaction simulation details.
- Drainer risk is real: phishing UIs can request hidden approvals/transfers.

## Manual checklist
1. Use official tooling you control (CLI/wallet) and verify signatures.
2. List empty token accounts first; confirm each account is safe to close.
3. Simulate transaction before sending.
4. Confirm close authority is your wallet.
5. Keep logs/screenshots for every operation.

## Security notes
- Never paste seed phrase/private key into unknown websites.
- Prefer hardware wallet confirmation for main accounts.
- Revoke suspicious approvals after operations.

## Bot policy
- Profit reserve is virtual in dry-run analytics only.
- Live mode does not auto-transfer profits to another wallet.
- Rent refund remains manual until a future explicit local-script phase using official SPL Token tooling.
