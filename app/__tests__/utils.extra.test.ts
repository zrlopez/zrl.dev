/**
 * Pure utility unit tests — raises Codacy coverage on app/utils.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clamp } from '~/utils/clamp';
import { buildContentSecurityPolicy } from '~/utils/csp';
import { formatDate } from '~/utils/date';
import { delay } from '~/utils/delay';
import { humansText } from '~/utils/humans';
import { baseMeta } from '~/utils/meta';
import {
  checkContactRateLimit,
  CONTACT_RATE_LIMIT,
} from '~/utils/rate-limit';
import {
  classes,
  cssProps,
  media,
  msToNum,
  numToMs,
  numToPx,
  pxToNum,
  pxToRem,
  rgbToThreeColor,
} from '~/utils/style';
import { throttle } from '~/utils/throttle';
import { formatTimecode, readingTime, zeroPrefix } from '~/utils/timecode';
import { resolveRuntimeEnv, validateContactEnv } from '~/utils/env';
import { hashIp } from '~/utils/security';
import {
  generateImage,
  loadImageFromSrcSet,
  resolveSrcFromSrcSet,
} from '~/utils/image';
import { getSessionSecret, getSessionStorage } from '~/utils/session.server';

// ── clamp ────────────────────────────────────────────────────────────────────

describe('clamp()', () => {
  it('treats a single bound as a max ceiling', () => {
    // Implementation: without boundTwo, values above boundOne snap down.
    expect(clamp(5, 10)).toBe(5);
    expect(clamp(15, 10)).toBe(10);
  });

  it('clamps within [min, max]', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(11, 0, 10)).toBe(10);
    expect(clamp(5, 0, 10)).toBe(5);
  });
});

// ── date / delay / throttle / timecode ───────────────────────────────────────

describe('formatDate()', () => {
  it('formats an ISO date string', () => {
    const out = formatDate('2026-09-01T12:00:00Z');
    expect(out).toMatch(/2026/);
    expect(out.length).toBeGreaterThan(5);
  });
});

describe('delay()', () => {
  it('resolves after the given ms', async () => {
    vi.useFakeTimers();
    const p = delay(50);
    await vi.advanceTimersByTimeAsync(50);
    await expect(p).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});

describe('throttle()', () => {
  it('invokes immediately then suppresses calls inside the window', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const t = throttle(fn, 1000);
    t('a');
    t('b');
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('a');
    vi.advanceTimersByTime(1000);
    t('c');
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith('c');
    vi.useRealTimers();
  });
});

describe('timecode', () => {
  it('zeroPrefix pads single digits', () => {
    expect(zeroPrefix(3)).toBe('03');
    expect(zeroPrefix(12)).toBe('12');
  });

  it('formatTimecode returns h:m:s:c', () => {
    expect(formatTimecode(0)).toBe('00:00:00:00');
    expect(formatTimecode(61_010)).toMatch(/^\d{2}:\d{2}:\d{2}:\d{2}$/);
  });

  it('readingTime scales with word count', () => {
    const short = readingTime('one two three');
    const long = readingTime(Array(450).fill('word').join(' '));
    expect(long).toBeGreaterThan(short);
    expect(long).toBeCloseTo(2 * 60 * 1000, -2); // ~2 minutes at 225 wpm
  });
});

// ── style ────────────────────────────────────────────────────────────────────

describe('style helpers', () => {
  it('exposes media breakpoints', () => {
    expect(media.mobile).toBe(696);
    expect(media.desktop).toBe(2080);
  });

  it('converts px / rem / ms tokens', () => {
    expect(pxToNum('16px')).toBe(16);
    expect(numToPx(16)).toBe('16px');
    expect(pxToRem(16)).toBe('1rem');
    expect(msToNum('250ms')).toBe(250);
    expect(numToMs(250)).toBe('250ms');
  });

  it('rgbToThreeColor normalizes 0-255 channels', () => {
    expect(rgbToThreeColor('255 0 128')).toEqual([1, 0, 128 / 255]);
    expect(rgbToThreeColor(undefined)).toEqual([]);
  });

  it('cssProps builds CSS variables with unit rules', () => {
    const props = cssProps(
      { width: 10, delay: 200, opacity: 0.5, color: 'red' },
      { display: 'block' }
    ) as Record<string, string>;
    expect(props['--width']).toBe('10px');
    expect(props['--delay']).toBe('200ms');
    expect(props['--opacity']).toBe('50%');
    expect(props['--color']).toBe('red');
    expect(props.display).toBe('block');
  });

  it('classes filters falsy values', () => {
    expect(classes('a', false, null, 'b', undefined, '')).toBe('a b');
  });
});

// ── meta / csp / humans ──────────────────────────────────────────────────────

describe('baseMeta()', () => {
  it('joins prefix and title and emits core tags', () => {
    const tags = baseMeta({
      title: 'AI/ML Data Operations Analyst',
      description: 'Portfolio description',
    });
    const title = tags.find(t => t.title)?.title;
    expect(title).toBe('Zachary Ryan Lopez | AI/ML Data Operations Analyst');
    expect(tags.some(t => t.name === 'description')).toBe(true);
    expect(tags.some(t => t.property === 'og:title')).toBe(true);
    expect(tags.some(t => t.property === 'twitter:card')).toBe(true);
  });

  it('allows custom prefix and og image', () => {
    const tags = baseMeta({
      title: 'Tools',
      description: 'd',
      prefix: 'Custom',
      ogImage: 'https://example.com/og.png',
    });
    expect(tags.find(t => t.title)?.title).toBe('Custom | Tools');
    expect(tags.find(t => t.property === 'og:image')?.content).toBe(
      'https://example.com/og.png'
    );
  });
});

describe('buildContentSecurityPolicy()', () => {
  it('embeds nonce and Turnstile / wasm allowances', () => {
    const csp = buildContentSecurityPolicy('abc123');
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("'nonce-abc123'");
    expect(csp).toContain('wasm-unsafe-eval');
    expect(csp).toContain('https://challenges.cloudflare.com');
    expect(csp).toContain("frame-ancestors 'none'");
  });
});

describe('humansText', () => {
  it('includes identity and stack markers', () => {
    expect(humansText).toContain('Zachary Ryan Lopez');
    expect(humansText).toContain('AI/ML Data Operations Analyst');
    expect(humansText).toContain('Remix');
    expect(humansText).toContain('https://zrl.dev');
  });
});

// ── rate-limit ───────────────────────────────────────────────────────────────

describe('checkContactRateLimit()', () => {
  const ip = `test-ip-${Math.random().toString(16).slice(2)}`;

  it('allows traffic under the memory limit then blocks', async () => {
    for (let i = 0; i < CONTACT_RATE_LIMIT.maxRequests; i++) {
      const r = await checkContactRateLimit(ip, undefined, 'req-1');
      expect(r.allowed).toBe(true);
      expect(r.backend).toBe('memory');
    }
    const blocked = await checkContactRateLimit(ip, undefined, 'req-2');
    expect(blocked.allowed).toBe(false);
    expect(blocked.reason).toBe('limit');
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('uses KV when provided', async () => {
    const store = new Map();
    const kv = {
      get: vi.fn(async (key, type) => {
        const raw = store.get(key);
        if (!raw) return null;
        return type === 'json' ? JSON.parse(raw) : raw;
      }),
      put: vi.fn(async (key, value) => {
        store.set(key, value);
      }),
    };
    const r1 = await checkContactRateLimit('kv-ip-1', kv, 'r1');
    expect(r1.allowed).toBe(true);
    expect(r1.backend).toBe('kv');
    expect(kv.put).toHaveBeenCalled();

    // Fill remaining quota then block
    for (let i = 0; i < CONTACT_RATE_LIMIT.maxRequests - 1; i++) {
      await checkContactRateLimit('kv-ip-1', kv, `r-${i}`);
    }
    const blocked = await checkContactRateLimit('kv-ip-1', kv, 'r-block');
    expect(blocked.allowed).toBe(false);
  });

  it('falls back to memory when KV throws', async () => {
    const kv = {
      get: vi.fn(async () => {
        throw new Error('kv down');
      }),
      put: vi.fn(),
    };
    const r = await checkContactRateLimit(`kv-fail-${Date.now()}`, kv, 'rid');
    expect(r.allowed).toBe(true);
    expect(r.backend).toBe('memory');
  });
});

// ── env extras ───────────────────────────────────────────────────────────────

describe('resolveRuntimeEnv()', () => {
  it('prefers cloudflare.env then env then process.env', () => {
    expect(resolveRuntimeEnv({ cloudflare: { env: { A: '1' } } })).toEqual({
      A: '1',
    });
    expect(resolveRuntimeEnv({ env: { B: '2' } })).toEqual({ B: '2' });
    expect(resolveRuntimeEnv({})).toBe(process.env);
  });
});

describe('validateContactEnv() edge cases', () => {
  const valid = {
    RESEND_API_KEY: 're_test_key_abcdefghijklmnopqrstuvwxyz',
    TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
    TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
  };

  it('accepts NEXT_PUBLIC and VITE site key aliases', () => {
    const { TURNSTILE_SITE_KEY, ...rest } = valid;
    expect(
      validateContactEnv({
        ...rest,
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: TURNSTILE_SITE_KEY,
      }).TURNSTILE_SITE_KEY
    ).toBe(TURNSTILE_SITE_KEY);
    expect(
      validateContactEnv({
        ...rest,
        VITE_TURNSTILE_SITE_KEY: TURNSTILE_SITE_KEY,
      }).TURNSTILE_SITE_KEY
    ).toBe(TURNSTILE_SITE_KEY);
  });

  it('throws when Turnstile secret is too short', () => {
    expect(() =>
      validateContactEnv({ ...valid, TURNSTILE_SECRET_KEY: 'short' })
    ).toThrow(/too short/);
  });

  it('parses custom hostnames and contact routing', () => {
    const result = validateContactEnv({
      ...valid,
      TURNSTILE_HOSTNAMES: ' Example.COM , zrl.dev ',
      CONTACT_TO: 'me@zrl.dev',
      CONTACT_FROM: 'Site <no-reply@zrl.dev>',
    });
    expect(result.TURNSTILE_HOSTNAMES).toEqual(['example.com', 'zrl.dev']);
    expect(result.CONTACT_TO).toBe('me@zrl.dev');
    expect(result.CONTACT_FROM).toBe('Site <no-reply@zrl.dev>');
  });
});

// ── security hashIp ──────────────────────────────────────────────────────────

describe('hashIp()', () => {
  it('returns a stable 16-char hex digest', async () => {
    const a = await hashIp('1.2.3.4');
    const b = await hashIp('1.2.3.4');
    const c = await hashIp('5.6.7.8');
    expect(a).toMatch(/^[0-9a-f]{16}$/);
    expect(a).toBe(b);
    expect(a).not.toBe(c);
  });

  it('handles empty ip as unknown', async () => {
    const h = await hashIp('');
    expect(h).toMatch(/^[0-9a-f]{16}$/);
  });
});

// ── image helpers (jsdom) ────────────────────────────────────────────────────

describe('image helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loadImageFromSrcSet rejects when neither src nor srcSet given', async () => {
    await expect(loadImageFromSrcSet({})).rejects.toMatch(/No image src/);
  });

  it('loadImageFromSrcSet resolves currentSrc on load', async () => {
    class FakeImage {
      constructor() {
        this._listeners = {};
        this.src = '';
        this.srcset = '';
        this.sizes = '';
        this.currentSrc = '';
      }
      addEventListener(type, fn) {
        this._listeners[type] = fn;
        queueMicrotask(() => {
          this.currentSrc = this.src || this.srcset || 'resolved.png';
          this._listeners.load?.();
        });
      }
      removeEventListener() {}
    }
    vi.stubGlobal('Image', FakeImage);

    const src = await loadImageFromSrcSet({
      src: 'https://example.com/a.png',
      srcSet: 'a.png 1x',
      sizes: '100vw',
    });
    expect(src).toBe('https://example.com/a.png');
  });

  it('generateImage returns an object URL', async () => {
    const fakeCtx = {
      fillStyle: '',
      fillRect: vi.fn(),
    };
    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: () => fakeCtx,
      toBlob: cb => cb(new Blob(['x'], { type: 'image/png' })),
      remove: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(fakeCanvas as any);
    // jsdom may lack createObjectURL — define then spy
    if (!URL.createObjectURL) {
      // @ts-expect-error test polyfill
      URL.createObjectURL = () => 'blob:mock';
    }
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');

    await expect(generateImage(2, 3)).resolves.toBe('blob:mock');
    expect(fakeCanvas.width).toBe(2);
    expect(fakeCanvas.height).toBe(3);
  });

  it('resolveSrcFromSrcSet picks matching source', async () => {
    const fakeCtx = { fillStyle: '', fillRect: vi.fn() };
    const fakeCanvas = {
      width: 0,
      height: 0,
      getContext: () => fakeCtx,
      toBlob: cb => cb(new Blob(['x'], { type: 'image/png' })),
      remove: vi.fn(),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(fakeCanvas as any);

    let blobCounter = 0;
    if (!URL.createObjectURL) {
      // @ts-expect-error test polyfill
      URL.createObjectURL = () => 'blob:x';
    }
    vi.spyOn(URL, 'createObjectURL').mockImplementation(
      () => `blob:img-${blobCounter++}`
    );

    class FakeImage {
      _listeners: Record<string, () => void> = {};
      srcset = '';
      currentSrc = '';
      addEventListener(type: string, fn: () => void) {
        this._listeners[type] = fn;
        queueMicrotask(() => {
          this.currentSrc = this.srcset.split(',')[0].trim().split(' ')[0];
          this._listeners.load?.();
        });
      }
      removeEventListener() {}
    }
    vi.stubGlobal('Image', FakeImage);

    const src = await resolveSrcFromSrcSet({
      srcSet: '/a.png 1280w, /b.png 2560w',
      sizes: '100vw',
    });
    expect(src).toBe('/a.png');
  });
});

// ── session.server ───────────────────────────────────────────────────────────

vi.mock('@remix-run/cloudflare', () => ({
  createCookieSessionStorage: vi.fn(opts => ({ kind: 'storage', opts })),
}));

describe('session.server', () => {
  const prev = process.env.SESSION_SECRET;

  afterEach(() => {
    if (prev === undefined) delete process.env.SESSION_SECRET;
    else process.env.SESSION_SECRET = prev;
  });

  it('getSessionSecret reads cloudflare env, env, then process.env', () => {
    expect(
      getSessionSecret({ cloudflare: { env: { SESSION_SECRET: 'cf' } } })
    ).toBe('cf');
    expect(getSessionSecret({ env: { SESSION_SECRET: 'ctx' } })).toBe('ctx');
    process.env.SESSION_SECRET = 'proc';
    expect(getSessionSecret({})).toBe('proc');
    delete process.env.SESSION_SECRET;
    expect(getSessionSecret({})).toBeNull();
  });

  it('getSessionStorage returns null without secret and storage with secret', () => {
    expect(getSessionStorage(null)).toBeNull();
    const storage = getSessionStorage('keep-it-secret');
    expect(storage.kind).toBe('storage');
    expect(storage.opts.cookie.name).toBe('__session');
    expect(storage.opts.cookie.secrets).toEqual(['keep-it-secret']);
  });
});
