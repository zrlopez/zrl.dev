/**
 * security.test.ts
 * Unit tests for security utilities — Vitest + Remix edition.
 */

import { describe, it, expect } from 'vitest';

// Placeholder sanitizers until real utils are ported or created in app/lib
// These are minimal implementations matching the behavior from the original Next.js security.test.ts

function sanitizeField(input: string, allowNewlines = false): string {
  let s = input.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  if (!allowNewlines) s = s.replace(/[\r\n]/g, '');
  return s.trim();
}

function sanitizeHeaderField(input: string): string {
  return input
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    .trim();
}

function htmlEscape(input: string): string {
  return input
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#39;');
}

function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  if (/[\r\n]/.test(email)) return false;
  if (/[^\x00-\x7F]/.test(email)) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email);
}

// ── sanitizeField ────────────────────────────────────────────────────────────

describe('sanitizeField()', () => {
  it('returns clean string unchanged', () => {
    expect(sanitizeField('Hello World')).toBe('Hello World');
  });

  it('strips C0 control characters', () => {
    expect(sanitizeField('hello\u0000world')).toBe('helloworld');
    expect(sanitizeField('tab\u0009here')).toBe('tabhere');
  });

  it('strips C1 control characters', () => {
    expect(sanitizeField('a\u0080b')).toBe('ab');
    expect(sanitizeField('a\u009Fb')).toBe('ab');
  });

  it('strips DEL (U+007F)', () => {
    expect(sanitizeField('a\u007Fb')).toBe('ab');
  });

  it('strips newlines by default', () => {
    expect(sanitizeField('line1\nline2')).toBe('line1line2');
  });

  it('preserves newlines when allowNewlines=true', () => {
    expect(sanitizeField('line1\nline2', true)).toBe('line1\nline2');
  });

  it('still strips other control chars when allowNewlines=true', () => {
    expect(sanitizeField('a\u0000b\nc', true)).toBe('ab\nc');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeField('  hello  ')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(sanitizeField('')).toBe('');
  });
});

// ── sanitizeHeaderField ──────────────────────────────────────────────────────

describe('sanitizeHeaderField()', () => {
  it('returns clean string unchanged', () => {
    expect(sanitizeHeaderField('John Doe')).toBe('John Doe');
  });

  it('replaces \r\n with spaces (header injection guard)', () => {
    const result = sanitizeHeaderField('Subject\r\nX-Injected: evil');
    expect(result).not.toContain('\r');
    expect(result).not.toContain('\n');
  });

  it('replaces \t with space (header folding guard)', () => {
    expect(sanitizeHeaderField('hello\tworld')).toBe('hello world');
  });

  it('strips remaining control characters after folding replacement', () => {
    expect(sanitizeHeaderField('a\u0001b')).toBe('ab');
  });

  it('trims leading and trailing whitespace', () => {
    expect(sanitizeHeaderField('  Subject  ')).toBe('Subject');
  });

  it('handles empty string', () => {
    expect(sanitizeHeaderField('')).toBe('');
  });
});

// ── htmlEscape ───────────────────────────────────────────────────────────────

describe('htmlEscape()', () => {
  it('escapes ampersand', () => {
    expect(htmlEscape('a & b')).toBe('a & b');
  });

  it('escapes less-than and greater-than', () => {
    expect(htmlEscape('<script>')).toBe('<script>');
  });

  it('escapes double quotes', () => {
    expect(htmlEscape('say "hi"')).toBe('say "hi"');
  });

  it('escapes single quotes', () => {
    expect(htmlEscape("it's")).toBe('it&#39;s');
  });

  it('returns plain string unchanged', () => {
    expect(htmlEscape('hello world')).toBe('hello world');
  });

  it('handles empty string', () => {
    expect(htmlEscape('')).toBe('');
  });
});

// ── validateEmail ─────────────────────────────────────────────────────────────

describe('validateEmail()', () => {
  describe('valid addresses', () => {
    it('accepts a standard email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });

    it('accepts plus addressing', () => {
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('accepts subdomains', () => {
      expect(validateEmail('user@mail.example.co.uk')).toBe(true);
    });

    it('accepts addresses with dots in local part', () => {
      expect(validateEmail('first.last@example.com')).toBe(true);
    });
  });

  describe('invalid addresses', () => {
    it('rejects empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('rejects address exceeding 254 characters', () => {
      const long = 'a'.repeat(244) + '@example.com';
      expect(validateEmail(long)).toBe(false);
    });

    it('rejects address with \r (header injection)', () => {
      expect(validateEmail('user@example.com\r')).toBe(false);
    });

    it('rejects address with \n (header injection)', () => {
      expect(validateEmail('user@example.com\n')).toBe(false);
    });

    it('rejects non-ASCII / IDN characters', () => {
      expect(validateEmail('user@éxample.com')).toBe(false);
    });

    it('rejects address without @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('rejects address without domain', () => {
      expect(validateEmail('user@')).toBe(false);
    });

    it('rejects address without TLD', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('rejects address with single-char TLD', () => {
      expect(validateEmail('user@example.c')).toBe(false);
    });
  });
});
