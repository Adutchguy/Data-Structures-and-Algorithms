'use strict';

import Queue from '../../data-structures/queue.js';

/**
 * Stack and queue problems
 *
 * Stacks fit anything "most recent unfinished thing first": nested brackets,
 * expression parsing, undo, and the MONOTONIC STACK pattern - keep the stack
 * sorted so each element is pushed and popped at most once, turning O(n^2)
 * "look left/right for the next bigger/smaller" scans into O(n).
 */

// Are the brackets ()[]{} correctly nested and closed?
export function isBalanced(str) {
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '(' || ch === '[' || ch === '{') {
      stack.push(ch);
    } else if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

const OPERATORS = {
  '+': { precedence: 2, rightAssociative: false, apply: (a, b) => a + b },
  '-': { precedence: 2, rightAssociative: false, apply: (a, b) => a - b },
  '*': { precedence: 3, rightAssociative: false, apply: (a, b) => a * b },
  '/': { precedence: 3, rightAssociative: false, apply: (a, b) => a / b },
  '^': { precedence: 4, rightAssociative: true, apply: (a, b) => Math.pow(a, b) },
};

// Evaluate a postfix (reverse Polish) expression given as an array of tokens or a
// space-separated string: '3 4 + 2 *' -> 14.
export function evaluatePostfix(tokens) {
  const list = typeof tokens === 'string' ? tokens.trim().split(/\s+/) : tokens;
  const stack = [];
  list.forEach(token => {
    if (OPERATORS[token]) {
      if (stack.length < 2) throw new Error('Malformed expression');
      const b = stack.pop();
      const a = stack.pop();
      stack.push(OPERATORS[token].apply(a, b));
    } else {
      const value = Number(token);
      if (Number.isNaN(value)) throw new Error('Bad token: ' + token);
      stack.push(value);
    }
  });
  if (stack.length !== 1) throw new Error('Malformed expression');
  return stack[0];
}

/**
 * Shunting-yard algorithm: convert an infix expression like '3 + 4 * 2' to postfix
 * tokens. Operators wait on a stack until an operator of lower precedence arrives.
 * Supports + - * / ^ and parentheses (no unary minus).
 */
export function infixToPostfix(expression) {
  const tokens = expression.match(/\d+(\.\d+)?|[-+*/^()]/g) || [];
  const output = [];
  const stack = [];
  tokens.forEach(token => {
    if (OPERATORS[token]) {
      const o1 = OPERATORS[token];
      while (stack.length && OPERATORS[stack[stack.length - 1]]) {
        const o2 = OPERATORS[stack[stack.length - 1]];
        if (o2.precedence > o1.precedence || (o2.precedence === o1.precedence && !o1.rightAssociative)) {
          output.push(stack.pop());
        } else {
          break;
        }
      }
      stack.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') output.push(stack.pop());
      if (!stack.length) throw new Error('Mismatched parentheses');
      stack.pop(); // discard '('
    } else {
      output.push(token);
    }
  });
  while (stack.length) {
    const top = stack.pop();
    if (top === '(') throw new Error('Mismatched parentheses');
    output.push(top);
  }
  return output;
}

export function evaluateInfix(expression) {
  return evaluatePostfix(infixToPostfix(expression));
}

// For each element, the next strictly greater element to its right (or -1).
// Monotonic stack of indices still waiting for their answer, values decreasing.
export function nextGreaterElement(nums) {
  const result = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) result[i] = -1;
  const stack = [];
  nums.forEach((value, i) => {
    while (stack.length && nums[stack[stack.length - 1]] < value) {
      result[stack.pop()] = value;
    }
    stack.push(i);
  });
  return result;
}

// For each day, how many days until a warmer temperature (0 if never).
export function dailyTemperatures(temps) {
  const result = new Array(temps.length);
  for (let i = 0; i < temps.length; i++) result[i] = 0;
  const stack = [];
  temps.forEach((t, i) => {
    while (stack.length && temps[stack[stack.length - 1]] < t) {
      const previous = stack.pop();
      result[previous] = i - previous;
    }
    stack.push(i);
  });
  return result;
}

// Stock span: for each day, how many consecutive days up to and including it had a
// price <= today's.
export function stockSpan(prices) {
  const spans = [];
  const stack = []; // indices with strictly decreasing prices
  prices.forEach((price, i) => {
    while (stack.length && prices[stack[stack.length - 1]] <= price) stack.pop();
    spans.push(stack.length ? i - stack[stack.length - 1] : i + 1);
    stack.push(i);
  });
  return spans;
}

// Largest rectangle in a histogram. When a bar is shorter than the stack's top, the
// top bar can't extend any further right, so finalise its rectangle. O(n).
export function largestRectangleInHistogram(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i]; // sentinel flushes the stack
    while (stack.length && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()];
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return best;
}

// Decode '3[a2[c]]' -> 'accaccacc'. A stack remembers the text and repeat count
// that were in progress when each '[' opened.
export function decodeString(s) {
  const stack = [];
  let current = '';
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      count = count * 10 + Number(ch);
    } else if (ch === '[') {
      stack.push([current, count]);
      current = '';
      count = 0;
    } else if (ch === ']') {
      const [previous, repeat] = stack.pop();
      current = previous + current.repeat(repeat);
    } else {
      current += ch;
    }
  }
  return current;
}

// Simplify a Unix path: '/a/./b/../../c/' -> '/c'
export function simplifyPath(path) {
  const stack = [];
  path.split('/').forEach(part => {
    if (part === '' || part === '.') return;
    if (part === '..') stack.pop();
    else stack.push(part);
  });
  return '/' + stack.join('/');
}

/**
 * Stack built from a single queue: after each push, rotate the queue so the newest
 * element comes to the front. push is O(n); pop and top are O(1).
 */
export class StackFromQueue {
  constructor() {
    this._queue = new Queue();
  }

  push(value) {
    this._queue.enqueue(value);
    for (let i = 0; i < this._queue.size - 1; i++) this._queue.enqueue(this._queue.dequeue());
    return this;
  }

  pop() {
    return this._queue.dequeue();
  }

  top() {
    return this._queue.peek();
  }

  isEmpty() {
    return this._queue.isEmpty();
  }

  get size() {
    return this._queue.size;
  }
}
