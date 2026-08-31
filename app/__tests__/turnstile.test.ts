/**
 * turnstile.test.ts — siteverify helper unit tests (mocked fetch)
 */

import { describe, it, expect, vi, afterEach } from 'vitest';
import { verifyTurnstile } from '~/utils/turnstile';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('verifyTurnstile()', () => {
  it('rejects empty token', async () => {
    const result = await verifyTurnstile({
      token: '',
      secret: 'secret-value-at-least-20',
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('invalid_token');
  });

  it('rejects overlong token', async () => {
    const result = await verifyTurnstile({
      token: 'x'.repeat(2049),
      secret: 'secret-value-at-least-20',
    });
    expect(result.ok).toBe(false);
  });

  it('returns ok on success + matching action/hostname', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          success: true,
          action: 'contact',
          hostname: 'zrl.dev',
        }),
      }))
    );

    const result = await verifyTurnstile({
      token: 'token',
      secret: 'secret-value-at-least-20',
      expectedAction: 'contact',
      expectedHostnames: ['zrl.dev'],
    });
    expect(result.ok).toBe(true);
  });

  it('fails closed on hostname mismatch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          success: true,
          action: 'contact',
          hostname: 'evil.example',
        }),
      }))
    );

    const result = await verifyTurnstile({
      token: 'token',
      secret: 'secret-value-at-least-20',
      expectedAction: 'contact',
      expectedHostnames: ['zrl.dev'],
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('hostname_mismatch');
  });

  it('fails closed when siteverify returns success:false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          success: false,
          'error-codes': ['invalid-input-response'],
        }),
      }))
    );

    const result = await verifyTurnstile({
      token: 'token',
      secret: 'secret-value-at-least-20',
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_success');
  });
});
