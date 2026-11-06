'use strict';

/**
 * Singly Linked List
 *
 * A chain of nodes where each node points to the next one. Unlike an array,
 * elements are not stored contiguously, so inserting/removing at a known
 * position never shifts other elements.
 *
 * Complexity
 *   prepend ............ O(1)
 *   append ............. O(1)  (we keep a tail pointer)
 *   get / indexOf ...... O(n)
 *   insertAt / removeAt  O(n)  (O(1) once the position is reached)
 *   reverse ............ O(n) time, O(1) extra space
 */

export class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static fromArray(values) {
    const list = new LinkedList();
    values.forEach(value => list.append(value));
    return list;
  }

  isEmpty() {
    return this.length === 0;
  }

  prepend(value) {
    const node = new ListNode(value, this.head);
    this.head = node;
    if (!this.tail) this.tail = node;
    this.length++;
    return this;
  }

  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  // Insert so that the new value ends up at `index` (0 = head, length = tail).
  insertAt(index, value) {
    if (index < 0 || index > this.length) throw new RangeError('Index out of bounds');
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);
    const prev = this._nodeAt(index - 1);
    prev.next = new ListNode(value, prev.next);
    this.length++;
    return this;
  }

  // Remove and return the value at `index`.
  removeAt(index) {
    if (index < 0 || index >= this.length) throw new RangeError('Index out of bounds');
    let removed;
    if (index === 0) {
      removed = this.head;
      this.head = removed.next;
      if (!this.head) this.tail = null;
    } else {
      const prev = this._nodeAt(index - 1);
      removed = prev.next;
      prev.next = removed.next;
      if (removed === this.tail) this.tail = prev;
    }
    this.length--;
    return removed.value;
  }

  // Remove the first node holding `value`. Returns true if something was removed.
  remove(value) {
    const index = this.indexOf(value);
    if (index === -1) return false;
    this.removeAt(index);
    return true;
  }

  get(index) {
    if (index < 0 || index >= this.length) return undefined;
    return this._nodeAt(index).value;
  }

  indexOf(value) {
    let current = this.head;
    let i = 0;
    while (current) {
      if (current.value === value) return i;
      current = current.next;
      i++;
    }
    return -1;
  }

  contains(value) {
    return this.indexOf(value) !== -1;
  }

  // Reverse in place by re-pointing every `next` pointer.
  reverse() {
    let prev = null;
    let current = this.head;
    this.tail = this.head;
    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.head = prev;
    return this;
  }

  // Middle node via the slow/fast pointer trick (second middle for even lengths).
  middle() {
    let slow = this.head;
    let fast = this.head;
    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }
    return slow ? slow.value : undefined;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  _nodeAt(index) {
    let current = this.head;
    for (let i = 0; i < index; i++) current = current.next;
    return current;
  }
}

/**
 * Floyd's tortoise and hare: detects a cycle in O(n) time and O(1) space.
 * Works on any chain of nodes that expose `.next`.
 */
export function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/**
 * Merge two sorted linked lists (given as head nodes) into one sorted chain.
 * Returns the head of the merged chain. Re-uses the existing nodes.
 */
export function mergeSorted(a, b) {
  const dummy = new ListNode(null);
  let tail = dummy;
  while (a && b) {
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}
