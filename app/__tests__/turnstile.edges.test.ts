/**
 * turnstile edge cases beyond the base suite.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstile } from '~/utils/turnstile';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('verifyTurnstile() edges', () => {
  it('rejects missing secret', async () => {
    const result = await verifyTurnstile({ token: 'tok', secret: '' });
    expect(result).toEqual({ ok: false, reason: 'missing_secret' });
  });

  it('rejects non-ok HTTP from siteverify', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 500, json: async () => ({}) }))
    );
    const result = await verifyTurnstile({
      token: 'tok',
      secret: 'secret-value-at-least-20',
    });
    expect(result.reason).toBe('siteverify_http');
  });

  it('rejects network failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('offline');
      })
    );
    const result = await verifyTurnstile({
      token: 'tok',
      secret: 'secret-value-at-least-20',
    });
    expect(result.reason).toBe('siteverify_network');
  });

  it('rejects unsuccessful siteverify payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: false, 'error-codes': ['timeout-or-duplicate'] }),
      }))
    );
    const result = await verifyTurnstile({
      token: 'tok',
      secret: 'secret-value-at-least-20',
    });
    expect(result.ok).toBe(false);
    expect(result.reason).toBe('not_success');
    expect(result.errorCodes).toContain('timeout-or-duplicate');
  });

  it('rejects action mismatch', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          success: true,
          action: 'login',
          hostname: 'zrl.dev',
        }),
      }))
    );
    const result = await verifyTurnstile({
      token: 'tok',
      secret: 'secret-value-at-least-20',
      expectedAction: 'contact',
    });
    expect(result.reason).toBe('action_mismatch');
  });

  it('rejects hostname mismatch and attaches remoteip when provided', async () => {
    const fetchMock = vi.fn(async (_url, init) => {
      expect(String(init.body)).toContain('remoteip=9.9.9.9');
      return {
        ok: true,
        json: async () => ({
          success: true,
          action: 'contact',
          hostname: 'evil.example',
        }),
      };
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await verifyTurnstile({
      token: 'tok',
      secret: 'secret-value-at-least-20',
      ip: '9.9.9.9',
      expectedAction: 'contact',
      expectedHostnames: ['zrl.dev'],
    });
    expect(result.reason).toBe('hostname_mismatch');
  });
});
