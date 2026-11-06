import LinkedList, { ListNode, hasCycle, mergeSorted } from './linked-list.js';

describe('LinkedList', () => {
  test('starts empty', () => {
    const list = new LinkedList();
    expect(list.isEmpty()).toBe(true);
    expect(list.toArray()).toEqual([]);
  });

  test('append and prepend', () => {
    const list = new LinkedList();
    list.append(2).append(3).prepend(1);
    expect(list.toArray()).toEqual([1, 2, 3]);
    expect(list.length).toBe(3);
    expect(list.tail.value).toBe(3);
  });

  test('insertAt handles head, middle and tail', () => {
    const list = LinkedList.fromArray([1, 3]);
    list.insertAt(1, 2).insertAt(0, 0).insertAt(4, 4);
    expect(list.toArray()).toEqual([0, 1, 2, 3, 4]);
    expect(() => list.insertAt(10, 1)).toThrow();
  });

  test('removeAt returns the value and keeps head/tail correct', () => {
    const list = LinkedList.fromArray([1, 2, 3]);
    expect(list.removeAt(2)).toBe(3);
    expect(list.tail.value).toBe(2);
    expect(list.removeAt(0)).toBe(1);
    expect(list.removeAt(0)).toBe(2);
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
    expect(() => list.removeAt(0)).toThrow();
  });

  test('remove by value', () => {
    const list = LinkedList.fromArray(['a', 'b', 'c']);
    expect(list.remove('b')).toBe(true);
    expect(list.remove('z')).toBe(false);
    expect(list.toArray()).toEqual(['a', 'c']);
  });

  test('get, indexOf and contains', () => {
    const list = LinkedList.fromArray([5, 6, 7]);
    expect(list.get(1)).toBe(6);
    expect(list.get(9)).toBeUndefined();
    expect(list.indexOf(7)).toBe(2);
    expect(list.indexOf(99)).toBe(-1);
    expect(list.contains(5)).toBe(true);
  });

  test('reverse', () => {
    const list = LinkedList.fromArray([1, 2, 3, 4]);
    list.reverse();
    expect(list.toArray()).toEqual([4, 3, 2, 1]);
    expect(list.head.value).toBe(4);
    expect(list.tail.value).toBe(1);
    list.append(0);
    expect(list.toArray()).toEqual([4, 3, 2, 1, 0]);
  });

  test('middle', () => {
    expect(LinkedList.fromArray([1, 2, 3]).middle()).toBe(2);
    expect(LinkedList.fromArray([1, 2, 3, 4]).middle()).toBe(3);
    expect(new LinkedList().middle()).toBeUndefined();
  });
});

describe('hasCycle', () => {
  test('false for a plain list, true once the tail points back', () => {
    const list = LinkedList.fromArray([1, 2, 3, 4]);
    expect(hasCycle(list.head)).toBe(false);
    list.tail.next = list.head.next;
    expect(hasCycle(list.head)).toBe(true);
    expect(hasCycle(null)).toBe(false);
  });
});

describe('mergeSorted', () => {
  test('merges two sorted chains', () => {
    const a = LinkedList.fromArray([1, 4, 6]);
    const b = LinkedList.fromArray([2, 3, 7, 8]);
    let node = mergeSorted(a.head, b.head);
    const out = [];
    while (node) {
      out.push(node.value);
      node = node.next;
    }
    expect(out).toEqual([1, 2, 3, 4, 6, 7, 8]);
    expect(mergeSorted(null, new ListNode(1)).value).toBe(1);
  });
});
