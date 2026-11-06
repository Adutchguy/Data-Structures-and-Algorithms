import * as greedy from './greedy.js';
import { coinChangeMin } from '../dynamic-programming/knapsack.js';

const {
  activitySelection, minRemovalsForNonOverlap, fractionalKnapsack, mergeIntervals,
  minMeetingRooms, canJump, minJumps, canCompleteCircuit, coinChangeGreedy,
  huffman, huffmanEncode, huffmanDecode,
} = greedy;

describe('interval greedy', () => {
  test('activitySelection picks the maximum number of compatible activities', () => {
    const activities = [
      [1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16],
    ].map(([start, end]) => ({ start, end }));
    const chosen = activitySelection(activities);
    expect(chosen.map(a => [a.start, a.end])).toEqual([[1, 4], [5, 7], [8, 11], [12, 16]]);
  });

  test('minRemovalsForNonOverlap', () => {
    expect(minRemovalsForNonOverlap([[1, 2], [2, 3], [3, 4], [1, 3]])).toBe(1);
    expect(minRemovalsForNonOverlap([[1, 2], [1, 2], [1, 2]])).toBe(2);
    expect(minRemovalsForNonOverlap([[1, 2], [2, 3]])).toBe(0);
  });

  test('mergeIntervals', () => {
    expect(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([[1, 6], [8, 10], [15, 18]]);
    expect(mergeIntervals([[1, 4], [4, 5]])).toEqual([[1, 5]]);
    expect(mergeIntervals([[8, 10], [1, 3], [2, 6]])).toEqual([[1, 6], [8, 10]]);
    expect(mergeIntervals([[1, 10], [2, 3]])).toEqual([[1, 10]]);
    expect(mergeIntervals([])).toEqual([]);
  });

  test('mergeIntervals does not mutate its input', () => {
    const input = [[1, 3], [2, 6]];
    mergeIntervals(input);
    expect(input).toEqual([[1, 3], [2, 6]]);
  });

  test('minMeetingRooms', () => {
    expect(minMeetingRooms([[0, 30], [5, 10], [15, 20]])).toBe(2);
    expect(minMeetingRooms([[7, 10], [2, 4]])).toBe(1);
    expect(minMeetingRooms([[1, 5], [2, 6], [3, 7]])).toBe(3);
    expect(minMeetingRooms([])).toBe(0);
  });
});

describe('fractionalKnapsack', () => {
  test('takes the best value per weight first and splits the last item', () => {
    const items = [{ weight: 10, value: 60 }, { weight: 20, value: 100 }, { weight: 30, value: 120 }];
    expect(fractionalKnapsack(items, 50)).toBe(240);
    expect(fractionalKnapsack(items, 5)).toBe(30);
    expect(fractionalKnapsack(items, 1000)).toBe(280);
    expect(fractionalKnapsack([], 10)).toBe(0);
  });
});

describe('jump games and circuits', () => {
  test('canJump', () => {
    expect(canJump([2, 3, 1, 1, 4])).toBe(true);
    expect(canJump([3, 2, 1, 0, 4])).toBe(false);
    expect(canJump([0])).toBe(true);
    expect(canJump([0, 1])).toBe(false);
  });

  test('minJumps', () => {
    expect(minJumps([2, 3, 1, 1, 4])).toBe(2);
    expect(minJumps([1, 1, 1, 1])).toBe(3);
    expect(minJumps([0])).toBe(0);
    expect(minJumps([1, 0, 1])).toBe(-1);
    expect(minJumps([10, 0, 0, 0])).toBe(1);
  });

  test('canCompleteCircuit', () => {
    expect(canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2])).toBe(3);
    expect(canCompleteCircuit([2, 3, 4], [3, 4, 3])).toBe(-1);
    expect(canCompleteCircuit([5], [4])).toBe(0);
  });
});

describe('coinChangeGreedy', () => {
  test('is optimal for US coins', () => {
    expect(coinChangeGreedy([1, 5, 10, 25], 63)).toEqual([25, 25, 10, 1, 1, 1]);
  });

  test('returns null when exact change is impossible', () => {
    expect(coinChangeGreedy([5, 10], 3)).toBeNull();
  });

  test('is NOT always optimal - dynamic programming beats it', () => {
    const coins = [4, 3, 1];
    expect(coinChangeGreedy(coins, 6).length).toBe(3); // 4 + 1 + 1
    expect(coinChangeMin(coins, 6)).toBe(2); // 3 + 3
  });
});

describe('huffman coding', () => {
  test('codes are prefix-free and round-trip', () => {
    const text = 'abracadabra';
    const { codes, root } = huffman(text);
    const symbols = Object.keys(codes);
    expect(symbols.sort()).toEqual(['a', 'b', 'c', 'd', 'r']);
    symbols.forEach(a => symbols.forEach(b => {
      if (a !== b) expect(codes[b].indexOf(codes[a])).not.toBe(0); // no code starts another
    }));
    const bits = huffmanEncode(text, codes);
    expect(huffmanDecode(bits, root)).toBe(text);
  });

  test('is optimal: abracadabra needs exactly 23 bits', () => {
    const { codes } = huffman('abracadabra');
    expect(huffmanEncode('abracadabra', codes).length).toBe(23);
    // more frequent characters never get longer codes than rarer ones
    expect(codes.a.length).toBeLessThanOrEqual(codes.c.length);
  });

  test('edge cases: empty text and a single repeated symbol', () => {
    expect(huffman('')).toEqual({ codes: {}, root: null });
    const { codes, root } = huffman('aaaa');
    expect(codes).toEqual({ a: '0' });
    expect(huffmanDecode(huffmanEncode('aaaa', codes), root)).toBe('aaaa');
  });

  test('handles longer text', () => {
    const text = 'the quick brown fox jumps over the lazy dog';
    const { codes, root } = huffman(text);
    const bits = huffmanEncode(text, codes);
    expect(huffmanDecode(bits, root)).toBe(text);
    expect(bits.length).toBeLessThan(text.length * 8);
  });
});
