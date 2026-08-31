/**
 * env.test.ts — contact env validation
 */

import { describe, it, expect } from 'vitest';
import { validateContactEnv } from '~/utils/env';

const valid = {
  RESEND_API_KEY: 're_test_key_abcdefghijklmnopqrstuvwxyz',
  TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA',
  TURNSTILE_SITE_KEY: '1x00000000000000000000AA',
};

describe('validateContactEnv()', () => {
  it('returns parsed env when valid', () => {
    const result = validateContactEnv(valid);
    expect(result.RESEND_API_KEY).toBe(valid.RESEND_API_KEY);
    expect(result.TURNSTILE_SECRET_KEY).toBe(valid.TURNSTILE_SECRET_KEY);
    expect(result.TURNSTILE_SITE_KEY).toBe(valid.TURNSTILE_SITE_KEY);
    expect(result.CONTACT_TO).toBe('hello@zrl.dev');
  });

  it('accepts TURNSTILE_SECRET alias', () => {
    const { TURNSTILE_SECRET_KEY, ...rest } = valid;
    const result = validateContactEnv({
      ...rest,
      TURNSTILE_SECRET: TURNSTILE_SECRET_KEY,
    });
    expect(result.TURNSTILE_SECRET_KEY).toBe(TURNSTILE_SECRET_KEY);
  });

  it('throws when RESEND_API_KEY missing', () => {
    expect(() =>
      validateContactEnv({ ...valid, RESEND_API_KEY: '' })
    ).toThrow(/RESEND_API_KEY/);
  });

  it('throws when RESEND_API_KEY has wrong prefix', () => {
    expect(() =>
      validateContactEnv({ ...valid, RESEND_API_KEY: 'not_a_resend_key' })
    ).toThrow(/re_/);
  });

  it('throws when Turnstile secret missing', () => {
    expect(() =>
      validateContactEnv({ ...valid, TURNSTILE_SECRET_KEY: '' })
    ).toThrow(/TURNSTILE_SECRET_KEY/);
  });

  it('throws when site key missing', () => {
    expect(() =>
      validateContactEnv({ ...valid, TURNSTILE_SITE_KEY: '' })
    ).toThrow(/TURNSTILE_SITE_KEY/);
  });
});
