import Deque from './deque.js';

describe('Deque', () => {
  test('works from both ends', () => {
    const d = new Deque();
    d.pushBack(2).pushBack(3).pushFront(1).pushFront(0);
    expect(d.toArray()).toEqual([0, 1, 2, 3]);
    expect(d.peekFront()).toBe(0);
    expect(d.peekBack()).toBe(3);
    expect(d.popFront()).toBe(0);
    expect(d.popBack()).toBe(3);
    expect(d.size).toBe(2);
  });

  test('can act as a stack', () => {
    const d = new Deque();
    d.pushBack(1).pushBack(2).pushBack(3);
    expect([d.popBack(), d.popBack(), d.popBack()]).toEqual([3, 2, 1]);
  });

  test('can act as a queue', () => {
    const d = new Deque();
    d.pushBack(1).pushBack(2).pushBack(3);
    expect([d.popFront(), d.popFront(), d.popFront()]).toEqual([1, 2, 3]);
  });

  test('empty deque returns undefined', () => {
    const d = new Deque();
    expect(d.isEmpty()).toBe(true);
    expect(d.popFront()).toBeUndefined();
    expect(d.popBack()).toBeUndefined();
    expect(d.peekFront()).toBeUndefined();
    expect(d.peekBack()).toBeUndefined();
  });
});
