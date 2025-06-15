import { describe, it, expect, beforeEach } from 'vitest';

// Global counter (buggy scenario)
let globalCounter = 0;
const generateWithGlobal = () => `global-${++globalCounter}`;

// Generator version
function* tempIdGenerator(prefix = 'temp') {
  let count = 1;
  while (true) {
    yield `${prefix}-${count++}`;
  }
}

describe('ID generation strategies', () => {
  beforeEach(() => {
    globalCounter = 0;
  });

  it('should generate unique IDs using global variable', () => {
    const ids = [generateWithGlobal(), generateWithGlobal(), generateWithGlobal()];
    expect(ids).toEqual(['global-1', 'global-2', 'global-3']);
  });

  it('should fail if state is not reset and causes duplicate IDs in multiple tests', () => {
    // Simulate an external module reusing the global counter without reset
    const firstId = generateWithGlobal();
    const secondId = generateWithGlobal();
    const thirdId = generateWithGlobal();
    expect(new Set([firstId, secondId, thirdId]).size).toBe(3); // All unique so far

    // Simulate another call in unrelated part of the app
    const repeatedId = generateWithGlobal();
    const ids = [firstId, secondId, thirdId, repeatedId];
    const hasDuplicates = new Set(ids).size !== ids.length;
    expect(hasDuplicates).toBe(false); // Should be false unless used incorrectly
  });

  it('should generate consistent and scoped IDs using generator', () => {
    const gen = tempIdGenerator('g');
    const ids = [gen.next().value, gen.next().value, gen.next().value];
    expect(ids).toEqual(['g-1', 'g-2', 'g-3']);
  });

  it('generator avoids global state collisions', () => {
    const gen1 = tempIdGenerator('gen');
    const gen2 = tempIdGenerator('gen');
    const id1 = gen1.next().value;
    const id2 = gen2.next().value;
    expect(id1).toBe('gen-1');
    expect(id2).toBe('gen-1'); // Independent generators
  });
});
