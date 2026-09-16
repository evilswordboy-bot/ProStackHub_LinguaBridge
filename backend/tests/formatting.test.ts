import { describe, it, expect } from 'vitest';

describe('Format Preservation Rules & Logic', () => {
  const sampleFormattedInput = `Hello!

1. Open the application.
2. Enter your name.
3. Click Submit.

Thank you.`;

  it('detects numbered list structure correctly', () => {
    const lines = sampleFormattedInput.split('\n');
    const listRegex = /^\s*(\d+[\.\)]|[\*\-•])\s+/;
    const listLines = lines.filter((l) => listRegex.test(l));

    expect(listLines.length).toBe(3);
    expect(listLines[0]).toContain('1. Open the application.');
    expect(listLines[1]).toContain('2. Enter your name.');
    expect(listLines[2]).toContain('3. Click Submit.');
  });

  it('verifies that line breaks and paragraphs are counted', () => {
    const lines = sampleFormattedInput.split('\n');
    expect(lines.length).toBe(7); // includes empty lines separating paragraphs
    const emptyLines = lines.filter((l) => l.trim() === '');
    expect(emptyLines.length).toBe(2);
  });

  it('flags flattened translation where multi-line structure is collapsed', () => {
    const origLines = sampleFormattedInput.split('\n');
    const collapsedOutput = 'Hello! 1. Open the application. 2. Enter your name. 3. Click Submit. Thank you.';
    const transLines = collapsedOutput.split('\n');

    const lineCountPreserved = origLines.length === 1 || transLines.length >= Math.floor(origLines.length * 0.7);
    expect(lineCountPreserved).toBe(false);
  });
});
