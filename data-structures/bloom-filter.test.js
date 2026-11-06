import BloomFilter from './bloom-filter.js';

describe('BloomFilter', () => {
  test('never reports a false negative', () => {
    const bloom = new BloomFilter(1000, 0.01);
    for (let i = 0; i < 1000; i++) bloom.add('item-' + i);
    for (let i = 0; i < 1000; i++) expect(bloom.mightContain('item-' + i)).toBe(true);
  });

  test('keeps the false-positive rate near the target', () => {
    const bloom = new BloomFilter(1000, 0.01);
    for (let i = 0; i < 1000; i++) bloom.add('item-' + i);
    let falsePositives = 0;
    const trials = 10000;
    for (let i = 0; i < trials; i++) {
      if (bloom.mightContain('other-' + i)) falsePositives++;
    }
    // target is 1%; allow generous slack so the test is not flaky
    expect(falsePositives / trials).toBeLessThan(0.03);
  });

  test('an empty filter contains nothing', () => {
    const bloom = new BloomFilter(100, 0.01);
    expect(bloom.mightContain('anything')).toBe(false);
  });

  test('sizes itself from the requested parameters', () => {
    const bloom = new BloomFilter(1000, 0.01);
    // ~9.6 bits per item and ~7 hash functions for a 1% rate
    expect(bloom.bitCount).toBeGreaterThan(9000);
    expect(bloom.bitCount).toBeLessThan(10500);
    expect(bloom.hashCount).toBe(7);
    const tighter = new BloomFilter(1000, 0.0001);
    expect(tighter.bitCount).toBeGreaterThan(bloom.bitCount);
  });

  test('numbers and strings are hashed by their text', () => {
    const bloom = new BloomFilter();
    bloom.add(42);
    expect(bloom.mightContain('42')).toBe(true);
  });
});
