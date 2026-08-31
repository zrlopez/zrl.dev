/**
 * Contact rate limiting.
 * Prefers Cloudflare KV (`RateLimitKV`) when bound; falls back to
 * per-isolate memory so Vercel/preview still have a soft brake.
 */

const RATE_LIMIT = {
  maxRequests: 5,
  windowMs: 3_600_000,
  expirationTtl: 3_660,
};

/** @type {Map<string, { count: number, windowStart: number }>} */
const memoryBuckets = new Map();

async function checkMemory(ip) {
  const key = `mem:${ip}`;
  const now = Date.now();
  const stored = memoryBuckets.get(key);
  const state =
    stored && now - stored.windowStart < RATE_LIMIT.windowMs
      ? stored
      : { count: 0, windowStart: now };

  if (state.count >= RATE_LIMIT.maxRequests) {
    const retryAfter = Math.max(
      1,
      Math.ceil((state.windowStart + RATE_LIMIT.windowMs - now) / 1000)
    );
    return { allowed: false, reason: 'limit', retryAfter };
  }

  const next = { count: state.count + 1, windowStart: state.windowStart };
  memoryBuckets.set(key, next);
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - next.count, backend: 'memory' };
}

async function checkKv(ip, kv, requestId) {
  try {
    const key = `cf_rl:${ip}`;
    const now = Date.now();
    const stored = /** @type {{ count: number, windowStart: number } | null} */ (
      await kv.get(key, 'json')
    );
    const state =
      stored && now - stored.windowStart < RATE_LIMIT.windowMs
        ? stored
        : { count: 0, windowStart: now };

    if (state.count >= RATE_LIMIT.maxRequests) {
      const retryAfter = Math.max(
        1,
        Math.ceil((state.windowStart + RATE_LIMIT.windowMs - now) / 1000)
      );
      return { allowed: false, reason: 'limit', retryAfter };
    }

    await kv.put(
      key,
      JSON.stringify({ count: state.count + 1, windowStart: state.windowStart }),
      { expirationTtl: RATE_LIMIT.expirationTtl }
    );

    return {
      allowed: true,
      remaining: RATE_LIMIT.maxRequests - state.count - 1,
      backend: 'kv',
    };
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'contact_rate_limit_error',
        requestId,
        error: error instanceof Error ? error.message : String(error),
        ts: new Date().toISOString(),
      })
    );
    // Degrade to memory rather than hard-failing contact on a KV blip.
    return checkMemory(ip);
  }
}

/**
 * @param {string} ip
 * @param {any} kv Cloudflare KV namespace or undefined
 * @param {string} requestId
 */
export async function checkContactRateLimit(ip, kv, requestId) {
  if (kv) return checkKv(ip, kv, requestId);
  return checkMemory(ip);
}

export const CONTACT_RATE_LIMIT = RATE_LIMIT;
