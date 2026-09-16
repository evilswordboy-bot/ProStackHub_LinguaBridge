import { describe, it, expect } from 'vitest';

describe('Frontend Format Preservation Suite (ProStackHub Task 1 Spec)', () => {
  const sampleInput = `Hello!

1. Open the application.
2. Enter your name.

Thank you.`;

  it('validates numbered list integrity in user input', () => {
    const listPattern = /^\s*\d+\.\s+/m;
    expect(listPattern.test(sampleInput)).toBe(true);

    const matches = sampleInput.match(/^\s*\d+\.\s+.*$/gm);
    expect(matches).not.toBeNull();
    expect(matches?.length).toBe(2);
  });

  it('validates line breaks and paragraph separations in structured texts', () => {
    const lines = sampleInput.split('\n');
    expect(lines.length).toBe(6);
    expect(lines[0]).toBe('Hello!');
    expect(lines[1]).toBe('');
    expect(lines[2]).toBe('1. Open the application.');
    expect(lines[3]).toBe('2. Enter your name.');
    expect(lines[4]).toBe('');
    expect(lines[5]).toBe('Thank you.');
  });

  it('ensures bullet lists and emojis are recognized', () => {
    const bulletText = `Key points:
- First milestone 🚀
- Second milestone 🌐
- Third milestone ✨`;

    const bulletMatches = bulletText.match(/^\s*-\s+.*$/gm);
    expect(bulletMatches?.length).toBe(3);
    expect(bulletText).toContain('🚀');
  });
});
