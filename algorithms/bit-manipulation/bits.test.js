import * as bits from './bits.js';

const {
  getBit, setBit, clearBit, toggleBit, updateBit, isOdd, isPowerOfTwo, isPowerOfFour,
  countSetBits, lowestSetBit, hammingDistance, reverseBits, nextPowerOfTwo, xorSwap,
  singleNumber, twoSingleNumbers, missingNumber, countBitsUpTo, subsetsBitmask, grayCode,
} = bits;

describe('single-bit operations', () => {
  test('get / set / clear / toggle / update', () => {
    expect(getBit(0b1010, 1)).toBe(1);
    expect(getBit(0b1010, 0)).toBe(0);
    expect(setBit(0b1010, 0)).toBe(0b1011);
    expect(clearBit(0b1010, 3)).toBe(0b0010);
    expect(toggleBit(0b1010, 1)).toBe(0b1000);
    expect(toggleBit(0b1000, 1)).toBe(0b1010);
    expect(updateBit(0b0000, 2, true)).toBe(0b0100);
    expect(updateBit(0b0111, 2, false)).toBe(0b0011);
  });

  test('isOdd', () => {
    expect([1, 3, 7, 99].every(isOdd)).toBe(true);
    expect([0, 2, 8, 100].some(isOdd)).toBe(false);
  });

  test('lowestSetBit', () => {
    expect(lowestSetBit(0b101000)).toBe(0b1000);
    expect(lowestSetBit(7)).toBe(1);
    expect(lowestSetBit(0)).toBe(0);
  });
});

describe('counting and powers', () => {
  test('isPowerOfTwo / isPowerOfFour', () => {
    [1, 2, 4, 8, 1024, 1073741824].forEach(n => expect(isPowerOfTwo(n)).toBe(true));
    [0, -2, 3, 6, 12, 1000].forEach(n => expect(isPowerOfTwo(n)).toBe(false));
    [1, 4, 16, 64, 256].forEach(n => expect(isPowerOfFour(n)).toBe(true));
    [2, 8, 32, 5, 0].forEach(n => expect(isPowerOfFour(n)).toBe(false));
  });

  test('countSetBits', () => {
    expect(countSetBits(0)).toBe(0);
    expect(countSetBits(0b1011)).toBe(3);
    expect(countSetBits(255)).toBe(8);
    expect(countSetBits(0xFFFFFFFF)).toBe(32);
    expect(countSetBits(-1)).toBe(32);
  });

  test('hammingDistance', () => {
    expect(hammingDistance(1, 4)).toBe(2);
    expect(hammingDistance(0b1111, 0b0000)).toBe(4);
    expect(hammingDistance(7, 7)).toBe(0);
  });

  test('countBitsUpTo', () => {
    expect(countBitsUpTo(8)).toEqual([0, 1, 1, 2, 1, 2, 2, 3, 1]);
    for (let n = 0; n < 200; n++) expect(countBitsUpTo(200)[n]).toBe(countSetBits(n));
  });

  test('nextPowerOfTwo', () => {
    expect([0, 1, 2, 3, 5, 8, 9, 1000].map(nextPowerOfTwo)).toEqual([1, 1, 2, 4, 8, 8, 16, 1024]);
  });

  test('reverseBits', () => {
    expect(reverseBits(0b00000010100101000001111010011100)).toBe(0b00111001011110000010100101000000);
    expect(reverseBits(1)).toBe(2147483648);
    expect(reverseBits(0)).toBe(0);
    expect(reverseBits(reverseBits(123456))).toBe(123456);
  });
});

describe('XOR tricks', () => {
  test('xorSwap', () => {
    expect(xorSwap(3, 9)).toEqual([9, 3]);
    expect(xorSwap(-5, 5)).toEqual([5, -5]);
  });

  test('singleNumber', () => {
    expect(singleNumber([2, 2, 1])).toBe(1);
    expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
    expect(singleNumber([7])).toBe(7);
  });

  test('twoSingleNumbers', () => {
    expect(twoSingleNumbers([1, 2, 1, 3, 2, 5])).toEqual([3, 5]);
    expect(twoSingleNumbers([0, 1])).toEqual([0, 1]);
  });

  test('missingNumber', () => {
    expect(missingNumber([3, 0, 1])).toBe(2);
    expect(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])).toBe(8);
    expect(missingNumber([0])).toBe(1);
    expect(missingNumber([1])).toBe(0);
  });
});

describe('enumeration with masks', () => {
  test('subsetsBitmask', () => {
    const result = subsetsBitmask(['a', 'b', 'c']);
    expect(result.length).toBe(8);
    expect(result[0]).toEqual([]);
    expect(result[5]).toEqual(['a', 'c']);
    expect(result[7]).toEqual(['a', 'b', 'c']);
  });

  test('grayCode', () => {
    expect(grayCode(2)).toEqual([0, 1, 3, 2]);
    const codes = grayCode(4);
    expect(new Set(codes).size).toBe(16);
    for (let i = 1; i < codes.length; i++) expect(hammingDistance(codes[i], codes[i - 1])).toBe(1);
  });
});
