import * as sq from './stack-queue-problems.js';

const {
  isBalanced, evaluatePostfix, infixToPostfix, evaluateInfix, nextGreaterElement,
  dailyTemperatures, stockSpan, largestRectangleInHistogram, decodeString, simplifyPath,
  StackFromQueue,
} = sq;

describe('isBalanced', () => {
  test('accepts correctly nested brackets', () => {
    ['', '()', '()[]{}', '{[()]}', 'a(b[c]{d}e)f'].forEach(s => expect(isBalanced(s)).toBe(true));
  });

  test('rejects mismatched, unclosed or unopened brackets', () => {
    ['(', ')', '(]', '([)]', '{[}', '((())'].forEach(s => expect(isBalanced(s)).toBe(false));
  });
});

describe('expression evaluation', () => {
  test('evaluatePostfix', () => {
    expect(evaluatePostfix('3 4 + 2 *')).toBe(14);
    expect(evaluatePostfix(['2', '1', '+', '3', '*'])).toBe(9);
    expect(evaluatePostfix('4 13 5 / +')).toBeCloseTo(6.6, 10);
    expect(evaluatePostfix('2 3 ^')).toBe(8);
    expect(evaluatePostfix('5')).toBe(5);
  });

  test('evaluatePostfix rejects malformed input', () => {
    expect(() => evaluatePostfix('3 +')).toThrow();
    expect(() => evaluatePostfix('3 4')).toThrow();
    expect(() => evaluatePostfix('3 x +')).toThrow();
  });

  test('infixToPostfix respects precedence and associativity', () => {
    expect(infixToPostfix('3 + 4 * 2')).toEqual(['3', '4', '2', '*', '+']);
    expect(infixToPostfix('(3 + 4) * 2')).toEqual(['3', '4', '+', '2', '*']);
    expect(infixToPostfix('8 - 3 - 2')).toEqual(['8', '3', '-', '2', '-']); // left associative
    expect(infixToPostfix('2 ^ 3 ^ 2')).toEqual(['2', '3', '2', '^', '^']); // right associative
    expect(infixToPostfix('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3').join(' ')).toBe('3 4 2 * 1 5 - 2 3 ^ ^ / +');
  });

  test('evaluateInfix', () => {
    expect(evaluateInfix('3 + 4 * 2')).toBe(11);
    expect(evaluateInfix('(1 + 2) * (3 + 4)')).toBe(21);
    expect(evaluateInfix('10 / 4')).toBe(2.5);
    expect(evaluateInfix('2 ^ 3 ^ 2')).toBe(512);
    expect(evaluateInfix('12+3*(4-1)')).toBe(21);
    expect(evaluateInfix('3 + 4 * 2 / ( 1 - 5 ) ^ 2 ^ 3')).toBeCloseTo(3.0001220703125, 12);
  });

  test('mismatched parentheses are rejected', () => {
    expect(() => infixToPostfix('(1 + 2')).toThrow();
    expect(() => infixToPostfix('1 + 2)')).toThrow();
  });
});

describe('monotonic stack problems', () => {
  test('nextGreaterElement', () => {
    expect(nextGreaterElement([4, 5, 2, 25])).toEqual([5, 25, 25, -1]);
    expect(nextGreaterElement([13, 7, 6, 12])).toEqual([-1, 12, 12, -1]);
    expect(nextGreaterElement([3, 3, 3])).toEqual([-1, -1, -1]);
    expect(nextGreaterElement([])).toEqual([]);
  });

  test('dailyTemperatures', () => {
    expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([1, 1, 4, 2, 1, 1, 0, 0]);
    expect(dailyTemperatures([30, 40, 50, 60])).toEqual([1, 1, 1, 0]);
    expect(dailyTemperatures([30, 20, 10])).toEqual([0, 0, 0]);
  });

  test('stockSpan', () => {
    expect(stockSpan([100, 80, 60, 70, 60, 75, 85])).toEqual([1, 1, 1, 2, 1, 4, 6]);
    expect(stockSpan([10, 20, 30])).toEqual([1, 2, 3]);
  });

  test('largestRectangleInHistogram', () => {
    expect(largestRectangleInHistogram([2, 1, 5, 6, 2, 3])).toBe(10);
    expect(largestRectangleInHistogram([2, 4])).toBe(4);
    expect(largestRectangleInHistogram([1, 1, 1, 1])).toBe(4);
    expect(largestRectangleInHistogram([])).toBe(0);
    expect(largestRectangleInHistogram([5])).toBe(5);
  });
});

describe('string stack problems', () => {
  test('decodeString', () => {
    expect(decodeString('3[a]2[bc]')).toBe('aaabcbc');
    expect(decodeString('3[a2[c]]')).toBe('accaccacc');
    expect(decodeString('2[abc]3[cd]ef')).toBe('abcabccdcdcdef');
    expect(decodeString('10[x]')).toBe('xxxxxxxxxx');
    expect(decodeString('plain')).toBe('plain');
  });

  test('simplifyPath', () => {
    expect(simplifyPath('/home/')).toBe('/home');
    expect(simplifyPath('/a/./b/../../c/')).toBe('/c');
    expect(simplifyPath('/../')).toBe('/');
    expect(simplifyPath('/home//foo/')).toBe('/home/foo');
  });
});

describe('StackFromQueue', () => {
  test('behaves like a stack', () => {
    const stack = new StackFromQueue();
    stack.push(1).push(2).push(3);
    expect(stack.top()).toBe(3);
    expect(stack.size).toBe(3);
    expect(stack.pop()).toBe(3);
    stack.push(4);
    expect(stack.pop()).toBe(4);
    expect(stack.pop()).toBe(2);
    expect(stack.pop()).toBe(1);
    expect(stack.isEmpty()).toBe(true);
    expect(stack.pop()).toBeUndefined();
  });
});
