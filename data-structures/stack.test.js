import Stack, { MinStack } from './stack.js';

describe('Stack', () => {
  test('is last-in first-out', () => {
    const stack = new Stack();
    stack.push(1).push(2).push(3);
    expect(stack.size).toBe(3);
    expect(stack.peek()).toBe(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.isEmpty()).toBe(true);
  });

  test('pop and peek on an empty stack return undefined', () => {
    const stack = new Stack();
    expect(stack.pop()).toBeUndefined();
    expect(stack.peek()).toBeUndefined();
  });

  test('toArray lists bottom to top without mutating', () => {
    const stack = new Stack();
    stack.push('a').push('b');
    expect(stack.toArray()).toEqual(['a', 'b']);
    expect(stack.size).toBe(2);
  });
});

describe('MinStack', () => {
  test('tracks the minimum through pushes and pops', () => {
    const stack = new MinStack();
    stack.push(5).push(3).push(7).push(3).push(1);
    expect(stack.min()).toBe(1);
    stack.pop();
    expect(stack.min()).toBe(3);
    stack.pop();
    expect(stack.min()).toBe(3);
    stack.pop();
    expect(stack.min()).toBe(3);
    stack.pop();
    expect(stack.min()).toBe(5);
    expect(stack.peek()).toBe(5);
    expect(stack.size).toBe(1);
  });
});
