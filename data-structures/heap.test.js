import { Heap, MinHeap, MaxHeap, PriorityQueue, kLargest, RunningMedian } from './heap.js';

// Small deterministic pseudo-random generator so tests are repeatable.
function lcg(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state;
  };
}

describe('MinHeap / MaxHeap', () => {
  test('MinHeap pops in ascending order', () => {
    const heap = new MinHeap();
    [5, 3, 8, 1, 9, 2, 7].forEach(v => heap.push(v));
    expect(heap.peek()).toBe(1);
    const out = [];
    while (!heap.isEmpty()) out.push(heap.pop());
    expect(out).toEqual([1, 2, 3, 5, 7, 8, 9]);
  });

  test('MaxHeap pops in descending order', () => {
    const heap = new MaxHeap();
    [5, 3, 8, 1, 9].forEach(v => heap.push(v));
    expect(heap.pop()).toBe(9);
    expect(heap.pop()).toBe(8);
    expect(heap.size).toBe(3);
  });

  test('pop and peek on empty return undefined', () => {
    const heap = new MinHeap();
    expect(heap.pop()).toBeUndefined();
    expect(heap.peek()).toBeUndefined();
  });

  test('matches Array.sort on pseudo-random data', () => {
    const next = lcg(42);
    const values = [];
    for (let i = 0; i < 500; i++) values.push(next() % 1000);
    const heap = new MinHeap();
    values.forEach(v => heap.push(v));
    const out = [];
    while (!heap.isEmpty()) out.push(heap.pop());
    expect(out).toEqual(values.slice().sort((a, b) => a - b));
  });

  test('Heap.from heapifies in O(n) and respects a custom comparator', () => {
    const heap = Heap.from([{ n: 3 }, { n: 1 }, { n: 2 }], (a, b) => a.n - b.n);
    expect(heap.pop().n).toBe(1);
    expect(heap.pop().n).toBe(2);
    expect(heap.pop().n).toBe(3);
  });

  test('toSortedArray does not mutate the heap', () => {
    const heap = Heap.from([4, 2, 6]);
    expect(heap.toSortedArray()).toEqual([2, 4, 6]);
    expect(heap.size).toBe(3);
  });
});

describe('PriorityQueue', () => {
  test('lowest priority number comes out first, ties are FIFO', () => {
    const pq = new PriorityQueue();
    pq.enqueue('low', 10).enqueue('urgent', 1).enqueue('first-tie', 5).enqueue('second-tie', 5);
    expect(pq.peek()).toBe('urgent');
    expect(pq.dequeue()).toBe('urgent');
    expect(pq.dequeue()).toBe('first-tie');
    expect(pq.dequeue()).toBe('second-tie');
    expect(pq.dequeue()).toBe('low');
    expect(pq.dequeue()).toBeUndefined();
    expect(pq.isEmpty()).toBe(true);
  });
});

describe('kLargest', () => {
  test('returns the k largest values, largest first', () => {
    expect(kLargest([3, 1, 4, 1, 5, 9, 2, 6], 3)).toEqual([9, 6, 5]);
    expect(kLargest([1, 2], 5)).toEqual([2, 1]);
    expect(kLargest([], 3)).toEqual([]);
  });
});

describe('RunningMedian', () => {
  test('tracks the median as values stream in', () => {
    const rm = new RunningMedian();
    expect(rm.median()).toBeUndefined();
    rm.add(5);
    expect(rm.median()).toBe(5);
    rm.add(15);
    expect(rm.median()).toBe(10);
    rm.add(1);
    expect(rm.median()).toBe(5);
    rm.add(3);
    expect(rm.median()).toBe(4);
  });

  test('agrees with a brute-force median', () => {
    const next = lcg(7);
    const rm = new RunningMedian();
    const seen = [];
    for (let i = 0; i < 200; i++) {
      const v = next() % 100;
      rm.add(v);
      seen.push(v);
      const sorted = seen.slice().sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const expected = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      expect(rm.median()).toBe(expected);
    }
  });
});
