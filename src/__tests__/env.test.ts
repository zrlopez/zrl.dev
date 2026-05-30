/**
 * env.test.ts
 * Unit tests for src/lib/env.ts — validateEnv() branch coverage.
 *
 * All server-only imports are mocked via moduleNameMapper in jest.config.ts.
 * process.env is manipulated per-test via jest.replaceProperty / delete.
 */

jest.mock('server-only', () => ({}));

// Must import AFTER mock is registered
import { validateEnv } from '@/lib/env';

const VALID_ENV = {
  RESEND_API_KEY: 're_testkey_abc123',
  TURNSTILE_SECRET_KEY: 'turnstile_secret_key_valid',
};

function setEnv(overrides: Partial<typeof VALID_ENV> & Record<string, string | undefined> = {}) {
  const merged = { ...VALID_ENV, ...overrides };
  Object.entries(merged).forEach(([k, v]) => {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  });
}

beforeEach(() => setEnv());

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
});

describe('validateEnv()', () => {
  describe('happy path', () => {
    it('returns both keys when env is valid', () => {
      const result = validateEnv();
      expect(result.RESEND_API_KEY).toBe(VALID_ENV.RESEND_API_KEY);
      expect(result.TURNSTILE_SECRET_KEY).toBe(VALID_ENV.TURNSTILE_SECRET_KEY);
    });
  });

  describe('presence checks', () => {
    it('throws when RESEND_API_KEY is missing', () => {
      setEnv({ RESEND_API_KEY: undefined });
      expect(() => validateEnv()).toThrow('RESEND_API_KEY is missing');
    });

    it('throws when TURNSTILE_SECRET_KEY is missing', () => {
      setEnv({ TURNSTILE_SECRET_KEY: undefined });
      expect(() => validateEnv()).toThrow('TURNSTILE_SECRET_KEY is missing');
    });

    it('throws listing both errors when both keys are missing', () => {
      setEnv({ RESEND_API_KEY: undefined, TURNSTILE_SECRET_KEY: undefined });
      expect(() => validateEnv()).toThrow('RESEND_API_KEY is missing');
      expect(() => validateEnv()).toThrow('TURNSTILE_SECRET_KEY is missing');
    });
  });

  describe('format guards', () => {
    it('throws when RESEND_API_KEY does not start with re_', () => {
      setEnv({ RESEND_API_KEY: 'bad_key_format_here' });
      expect(() => validateEnv()).toThrow('unexpected format');
    });

    it('does not throw format error when RESEND_API_KEY starts with re_', () => {
      setEnv({ RESEND_API_KEY: 're_validkey' });
      expect(() => validateEnv()).not.toThrow();
    });

    it('throws when TURNSTILE_SECRET_KEY is shorter than 20 characters', () => {
      setEnv({ TURNSTILE_SECRET_KEY: 'tooshort' });
      expect(() => validateEnv()).toThrow('appears too short');
    });

    it('does not throw when TURNSTILE_SECRET_KEY is exactly 20 characters', () => {
      setEnv({ TURNSTILE_SECRET_KEY: '12345678901234567890' });
      expect(() => validateEnv()).not.toThrow();
    });
  });

  describe('error message format', () => {
    it('throws with [env] prefix and check your settings hint', () => {
      setEnv({ RESEND_API_KEY: undefined });
      expect(() => validateEnv()).toThrow('[env] Environment configuration errors');
      expect(() => validateEnv()).toThrow('Check your Vercel project settings');
    });

    it('collects multiple errors in a single throw', () => {
      setEnv({ RESEND_API_KEY: 'bad_format', TURNSTILE_SECRET_KEY: 'short' });
      let message = '';
      try { validateEnv(); } catch (e) { message = (e as Error).message; }
      expect(message).toContain('unexpected format');
      expect(message).toContain('appears too short');
    });
  });
});
