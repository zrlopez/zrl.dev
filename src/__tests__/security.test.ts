import {
  sanitizeField,
  sanitizeHeaderField,
  htmlEscape,
  validateEmail,
} from '@/lib/security'

describe('sanitizeField', () => {
  it('strips control characters', () => {
    expect(sanitizeField('\u0001hello\u001F')).toBe('hello')
  })
  it('preserves newlines when allowNewlines=true', () => {
    expect(sanitizeField('hello\nworld', true)).toBe('hello\nworld')
  })
  it('strips newlines by default', () => {
    expect(sanitizeField('hello\nworld')).toBe('helloworld')
  })
  it('trims whitespace', () => {
    expect(sanitizeField('  hi  ')).toBe('hi')
  })
})

describe('sanitizeHeaderField', () => {
  it('strips \\r\\n\\t (header injection chars)', () => {
    expect(sanitizeHeaderField('Subject\r\nBcc: evil@x.com')).not.toContain('\n')
  })
  it('returns a trimmed string', () => {
    expect(sanitizeHeaderField('  hello  ')).toBe('hello')
  })
})

describe('htmlEscape', () => {
  it('escapes & < > " \'', () => {
    const escaped = htmlEscape('<script>&"\'</script>')
    expect(escaped).toContain('&lt;')
    expect(escaped).toContain('&gt;')
    expect(escaped).toContain('&amp;')
    expect(escaped).toContain('&quot;')
    expect(escaped).not.toContain('<script>')
  })
})

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('user+tag@sub.domain.io')).toBe(true)
  })
  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
  it('rejects header injection', () => {
    expect(validateEmail('user@x.com\r\nBcc:evil@x.com')).toBe(false)
  })
  it('rejects non-ASCII (IDN)', () => {
    expect(validateEmail('user@éxample.com')).toBe(false)
  })
  it('rejects strings over 254 chars', () => {
    expect(validateEmail('a'.repeat(255) + '@x.com')).toBe(false)
  })
})
