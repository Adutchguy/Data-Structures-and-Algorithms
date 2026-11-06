import DoublyLinkedList from './doubly-linked-list.js';

describe('DoublyLinkedList', () => {
  test('append / prepend keep both directions consistent', () => {
    const list = new DoublyLinkedList();
    list.append(2);
    list.append(3);
    list.prepend(1);
    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.toArrayReversed()).toEqual([3, 2, 1]);
    expect(list.length).toBe(3);
  });

  test('shift and pop', () => {
    const list = DoublyLinkedList.fromArray([1, 2, 3]);
    expect(list.shift()).toBe(1);
    expect(list.pop()).toBe(3);
    expect(list.toArray()).toEqual([2]);
    expect(list.pop()).toBe(2);
    expect(list.pop()).toBeUndefined();
    expect(list.shift()).toBeUndefined();
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
  });

  test('removeNode unlinks a node in O(1)', () => {
    const list = new DoublyLinkedList();
    list.append('a');
    const b = list.append('b');
    list.append('c');
    expect(list.removeNode(b)).toBe('b');
    expect(list.toArray()).toEqual(['a', 'c']);
    expect(list.toArrayReversed()).toEqual(['c', 'a']);
  });

  test('insertAt from both halves of the list', () => {
    const list = DoublyLinkedList.fromArray([0, 1, 3, 4, 6]);
    list.insertAt(2, 2).insertAt(5, 5);
    expect(list.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(list.toArrayReversed()).toEqual([6, 5, 4, 3, 2, 1, 0]);
    expect(() => list.insertAt(99, 1)).toThrow();
  });

  test('get and removeAt walk from the nearest end', () => {
    const list = DoublyLinkedList.fromArray([10, 20, 30, 40, 50]);
    expect(list.get(0)).toBe(10);
    expect(list.get(4)).toBe(50);
    expect(list.get(2)).toBe(30);
    expect(list.get(5)).toBeUndefined();
    expect(list.removeAt(3)).toBe(40);
    expect(list.removeAt(1)).toBe(20);
    expect(list.toArray()).toEqual([10, 30, 50]);
    expect(() => list.removeAt(3)).toThrow();
  });

  test('indexOf and peeks', () => {
    const list = DoublyLinkedList.fromArray(['x', 'y', 'z']);
    expect(list.indexOf('z')).toBe(2);
    expect(list.indexOf('q')).toBe(-1);
    expect(list.peekFirst()).toBe('x');
    expect(list.peekLast()).toBe('z');
  });
});
