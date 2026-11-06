import DynamicArray from './dynamic-array.js';

describe('DynamicArray', () => {
  test('push grows capacity by doubling', () => {
    const arr = new DynamicArray(2);
    arr.push(1);
    arr.push(2);
    expect(arr.capacity).toBe(2);
    arr.push(3);
    expect(arr.capacity).toBe(4);
    expect(arr.toArray()).toEqual([1, 2, 3]);
    expect(arr.length).toBe(3);
  });

  test('get / set with bounds checking', () => {
    const arr = new DynamicArray();
    arr.push('a');
    arr.set(0, 'b');
    expect(arr.get(0)).toBe('b');
    expect(() => arr.get(1)).toThrow();
    expect(() => arr.set(-1, 'x')).toThrow();
  });

  test('pop returns the last value and shrinks when sparse', () => {
    const arr = new DynamicArray(4);
    for (let i = 0; i < 16; i++) arr.push(i);
    expect(arr.capacity).toBe(16);
    for (let i = 15; i >= 3; i--) expect(arr.pop()).toBe(i);
    expect(arr.capacity).toBeLessThan(16);
    expect(arr.toArray()).toEqual([0, 1, 2]);
    expect(new DynamicArray().pop()).toBeUndefined();
  });

  test('insertAt and removeAt shift elements', () => {
    const arr = new DynamicArray(2);
    [1, 2, 4, 5].forEach(v => arr.push(v));
    arr.insertAt(2, 3);
    arr.insertAt(0, 0);
    expect(arr.toArray()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(arr.removeAt(0)).toBe(0);
    expect(arr.removeAt(4)).toBe(5);
    expect(arr.toArray()).toEqual([1, 2, 3, 4]);
    expect(() => arr.insertAt(10, 1)).toThrow();
  });

  test('indexOf', () => {
    const arr = new DynamicArray();
    ['a', 'b', 'c'].forEach(v => arr.push(v));
    expect(arr.indexOf('c')).toBe(2);
    expect(arr.indexOf('z')).toBe(-1);
  });
});
