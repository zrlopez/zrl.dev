import { clsx } from 'clsx';

describe('smoke', () => {
  it('clsx utility works', () => {
    expect(clsx('foo', 'bar')).toBe('foo bar');
  });
});
