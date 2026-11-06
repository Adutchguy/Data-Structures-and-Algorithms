import CircularBuffer from './circular-buffer.js';

describe('CircularBuffer', () => {
  test('reads values back in the order they were written', () => {
    const buf = new CircularBuffer(3);
    buf.write(1).write(2).write(3);
    expect(buf.isFull()).toBe(true);
    expect(buf.read()).toBe(1);
    expect(buf.read()).toBe(2);
    expect(buf.size).toBe(1);
  });

  test('wraps around the end of the array', () => {
    const buf = new CircularBuffer(3);
    buf.write('a').write('b').write('c');
    buf.read();
    buf.read();
    buf.write('d').write('e');
    expect(buf.toArray()).toEqual(['c', 'd', 'e']);
    expect(buf.peek()).toBe('c');
  });

  test('throws when full unless overwrite is enabled', () => {
    const strict = new CircularBuffer(2);
    strict.write(1).write(2);
    expect(() => strict.write(3)).toThrow();

    const rolling = new CircularBuffer(2, { overwrite: true });
    rolling.write(1).write(2).write(3).write(4);
    expect(rolling.toArray()).toEqual([3, 4]);
    expect(rolling.size).toBe(2);
  });

  test('empty buffer returns undefined and rejects bad capacity', () => {
    const buf = new CircularBuffer(2);
    expect(buf.isEmpty()).toBe(true);
    expect(buf.read()).toBeUndefined();
    expect(buf.peek()).toBeUndefined();
    expect(() => new CircularBuffer(0)).toThrow();
  });
});
