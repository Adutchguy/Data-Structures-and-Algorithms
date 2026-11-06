'use strict';

/**
 * Doubly Linked List
 *
 * Every node knows both its successor and predecessor, so we can walk in either
 * direction and remove a node in O(1) when we already hold a reference to it.
 * The extra `prev` pointer costs memory but makes pop()/removeNode() O(1),
 * which a singly linked list cannot do.
 *
 * Complexity
 *   prepend / append ........ O(1)
 *   shift / pop ............. O(1)
 *   removeNode .............. O(1)
 *   get / insertAt / removeAt O(n)  (walks from the nearer end)
 */

export class DNode {
  constructor(value) {
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

export default class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static fromArray(values) {
    const list = new DoublyLinkedList();
    values.forEach(value => list.append(value));
    return list;
  }

  isEmpty() {
    return this.length === 0;
  }

  prepend(value) {
    const node = new DNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.length++;
    return node;
  }

  append(value) {
    const node = new DNode(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return node;
  }

  // Unlink a node we already hold a reference to. O(1).
  removeNode(node) {
    if (node.prev) node.prev.next = node.next;
    else this.head = node.next;
    if (node.next) node.next.prev = node.prev;
    else this.tail = node.prev;
    node.prev = node.next = null;
    this.length--;
    return node.value;
  }

  shift() {
    return this.head ? this.removeNode(this.head) : undefined;
  }

  pop() {
    return this.tail ? this.removeNode(this.tail) : undefined;
  }

  peekFirst() {
    return this.head ? this.head.value : undefined;
  }

  peekLast() {
    return this.tail ? this.tail.value : undefined;
  }

  insertAt(index, value) {
    if (index < 0 || index > this.length) throw new RangeError('Index out of bounds');
    if (index === 0) {
      this.prepend(value);
    } else if (index === this.length) {
      this.append(value);
    } else {
      const next = this._nodeAt(index);
      const node = new DNode(value);
      node.prev = next.prev;
      node.next = next;
      next.prev.next = node;
      next.prev = node;
      this.length++;
    }
    return this;
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) throw new RangeError('Index out of bounds');
    return this.removeNode(this._nodeAt(index));
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

  toArray() {
    const result = [];
    for (let node = this.head; node; node = node.next) result.push(node.value);
    return result;
  }

  toArrayReversed() {
    const result = [];
    for (let node = this.tail; node; node = node.prev) result.push(node.value);
    return result;
  }

  // Walk from whichever end is closer to the target index.
  _nodeAt(index) {
    let node;
    if (index < this.length / 2) {
      node = this.head;
      for (let i = 0; i < index; i++) node = node.next;
    } else {
      node = this.tail;
      for (let i = this.length - 1; i > index; i--) node = node.prev;
    }
    return node;
  }
}
