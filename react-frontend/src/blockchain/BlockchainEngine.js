/**
 * BlockchainEngine.js
 * Client-side dual-hash verification using Web Crypto API (SubtleCrypto).
 *   computeSHA256(data) → 64-char hex  (chain integrity)
 *   computeSHA512(data) → 128-char hex (tx receipt)
 *   verifyBlock(block)  → { sha256_ok, sha512_ok, prev_ok, valid }
 */

const encoder = new TextEncoder();

/** SHA-256 of a string → 64-char hex */
export async function computeSHA256(str) {
  const buf = await crypto.subtle.digest('SHA-256', encoder.encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** SHA-512 of a string → 128-char hex */
export async function computeSHA512(str) {
  const buf = await crypto.subtle.digest('SHA-512', encoder.encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/** Canonical payload string matching backend Block._payload_string() */
function payloadString(block) {
  const payload = {
    index:         block.index,
    timestamp:     block.timestamp,
    supplier_id:   block.supplier_id,
    supplier_name: block.supplier_name,
    tier:          block.tier,
    country:       block.country,
    inspector:     block.inspector,
    result:        block.result,
    risk_score:    block.risk_score,
    notes:         block.notes,
    prev_hash:     block.prev_hash,
  };
  // Sort keys to match Python json.dumps(sort_keys=True)
  return JSON.stringify(
    Object.fromEntries(Object.entries(payload).sort()),
  );
}

/**
 * Verify a single block (must have unhashed data — not REDACTED).
 * Returns { sha256_ok, sha512_ok, valid }
 */
export async function verifyBlock(block, prevBlock = null) {
  if (block.hash === 'REDACTED') {
    return { sha256_ok: null, sha512_ok: null, prev_ok: null, valid: null, redacted: true };
  }
  const payload = payloadString(block);
  const [sha256, sha512] = await Promise.all([computeSHA256(payload), computeSHA512(payload)]);
  const sha256_ok = sha256 === block.hash;
  const sha512_ok = sha512 === block.tx_hash;
  const prev_ok   = block.index === 0 || (prevBlock && block.prev_hash === prevBlock.hash);
  return {
    sha256_ok,
    sha512_ok,
    prev_ok: prev_ok ?? true,
    valid: sha256_ok && sha512_ok && (prev_ok ?? true),
    redacted: false,
  };
}

/** Verify all blocks in the chain array. Returns array of per-block results. */
export async function verifyChain(chain) {
  const results = [];
  for (let i = 0; i < chain.length; i++) {
    const result = await verifyBlock(chain[i], i > 0 ? chain[i - 1] : null);
    results.push({ index: chain[i].index, ...result });
  }
  return results;
}
