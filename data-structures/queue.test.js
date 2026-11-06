import Queue, { QueueFromStacks } from './queue.js';

[['Queue', Queue], ['QueueFromStacks', QueueFromStacks]].forEach(([name, Impl]) => {
  describe(name, () => {
    test('is first-in first-out', () => {
      const q = new Impl();
      q.enqueue(1).enqueue(2).enqueue(3);
      expect(q.size).toBe(3);
      expect(q.peek()).toBe(1);
      expect(q.dequeue()).toBe(1);
      expect(q.dequeue()).toBe(2);
      q.enqueue(4);
      expect(q.dequeue()).toBe(3);
      expect(q.dequeue()).toBe(4);
      expect(q.isEmpty()).toBe(true);
    });

    test('dequeue and peek on empty return undefined', () => {
      const q = new Impl();
      expect(q.dequeue()).toBeUndefined();
      expect(q.peek()).toBeUndefined();
    });

    test('handles many interleaved operations', () => {
      const q = new Impl();
      const expected = [];
      for (let i = 0; i < 100; i++) {
        q.enqueue(i);
        expected.push(i);
        if (i % 3 === 0) expect(q.dequeue()).toBe(expected.shift());
      }
      expect(q.size).toBe(expected.length);
      while (expected.length) expect(q.dequeue()).toBe(expected.shift());
    });
  });
});

test('Queue.toArray lists front to back', () => {
  const q = new Queue();
  q.enqueue('a').enqueue('b');
  expect(q.toArray()).toEqual(['a', 'b']);
});
