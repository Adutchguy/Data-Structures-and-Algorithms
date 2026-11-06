# Data-Structures-and-Algorithms
[![Build Status](https://travis-ci.org/Adutchguy/Data-Structures-and-Algorithms.svg?branch=master)](https://travis-ci.org/Adutchguy/Data-Structures-and-Algorithms)
## Purpose:

* Practice all kinds of algorthms and data structures concepts.
* Practice Testing.
* Get more familiarized with continuous integration (travis in this case).

Every implementation is written to be **read and studied**: each file opens with a
comment block explaining the idea and its complexity, and sits next to a Jest test
file that shows how to use it and cross-checks it against a brute-force answer.

## Running the tests

```bash
yarn install          # or: npm install
yarn test             # or: npm test        (runs Jest with coverage)
yarn test-watch       # re-run on save
npx jest data-structures/heap      # a single module
```

## Suggested study order

1. Read [`big-O-rules.md`](big-O-rules.md) and [`STUDY-GUIDE.md`](STUDY-GUIDE.md) (complexity cheat-sheet and "which technique?" table).
2. Linear structures: linked list, stack, queue, deque, dynamic array.
3. Hashing and trees: hash table, heap, binary search tree, then AVL tree and trie.
4. Sorting and searching, then array patterns (two pointers, sliding window).
5. Recursion: backtracking, divide and conquer, then dynamic programming.
6. Graphs: traversal, shortest paths, spanning trees, connectivity, flow.
7. The specialised structures: union-find, Fenwick tree, segment tree, sparse table, LRU cache, bloom filter, skip list.

## Data structures — `data-structures/`

| Structure | File | Highlights |
| --- | --- | --- |
| Singly linked list | `linked-list.js` | head/tail ops, insert/remove at index, reverse, cycle detection |
| Doubly linked list | `doubly-linked-list.js` | O(1) removal from both ends |
| Dynamic array | `dynamic-array.js` | amortised O(1) push via capacity doubling |
| Stack, MinStack | `stack.js` | O(1) `min()` alongside push/pop |
| Queue, QueueFromStacks | `queue.js` | amortised O(1) queue built from two stacks |
| Deque | `deque.js` | double-ended queue (used by sliding-window max) |
| Circular buffer | `circular-buffer.js` | fixed capacity ring buffer |
| Heap, MinHeap, MaxHeap, PriorityQueue | `heap.js` | k-largest, running median |
| Hash table | `hash-table.js` | separate chaining and open addressing |
| Binary search tree | `binary-search-tree.js` | insert/delete/search, traversals, `isValidBST` |
| AVL tree | `avl-tree.js` | self-balancing via rotations |
| Trie | `trie.js` | prefix search, autocomplete |
| Graph | `graph.js` | adjacency list, directed/undirected, weighted |
| Union-find | `union-find.js` | path compression + union by rank |
| Fenwick tree | `fenwick-tree.js` | prefix sums with point updates, O(log n) |
| Segment tree, LazySegmentTree | `segment-tree.js` | range queries; range updates with lazy propagation |
| Sparse table | `sparse-table.js` | O(1) range-minimum queries on static data |
| LRU cache | `lru-cache.js` | hash map + doubly linked list, O(1) get/put |
| Bloom filter | `bloom-filter.js` | probabilistic membership |
| Skip list | `skip-list.js` | randomised, O(log n) expected search |

## Algorithms — `algorithms/`

| Folder | File | Contents |
| --- | --- | --- |
| `sorting/` | `sorting.js` | bubble, selection, insertion, shell, merge, quick, heap, counting, radix, bucket |
| `searching/` | `searching.js` | linear, binary (iterative/recursive), lower/upper bound, jump, interpolation, exponential, ternary, rotated array, peak finding, binary search on the answer |
| `arrays/` | `array-patterns.js` | two sum / three sum, container with most water, trapping rain water, Dutch flag, sliding window, monotonic-deque window max, prefix sums, Boyer-Moore, Floyd cycle trick, next permutation, matrix spiral/rotate |
| `stacks-and-queues/` | `stack-queue-problems.js` | bracket matching, postfix and infix evaluation (shunting-yard), monotonic stack problems, histogram rectangle, decode string |
| `trees/` | `tree-problems.js` | traversals, level-order variants, depth, diameter, balance, max path sum, LCA, serialise, rebuild from traversals |
| `graph/` | `traversal.js` | BFS, DFS, components, cycle detection, topological sort, bipartite check, grid problems |
| | `shortest-paths.js` | Dijkstra, Bellman-Ford, Floyd-Warshall, A* |
| | `spanning-tree.js` | Kruskal, Prim |
| | `connectivity.js` | Tarjan and Kosaraju SCC, bridges, articulation points |
| | `max-flow.js` | Edmonds-Karp maximum flow |
| `dynamic-programming/` | `sequences.js` | Fibonacci, stairs, house robber, Kadane, LIS, LCS, edit distance, word break, decode ways |
| | `knapsack.js` | 0/1 and unbounded knapsack, rod cutting, coin change, subset sum, partition, target sum |
| | `grids.js` | unique paths, min path sum, triangle, maximal square, matrix-chain order |
| `greedy/` | `greedy.js` | activity selection, fractional knapsack, interval merging, meeting rooms, jump game, gas station, Huffman coding |
| `backtracking/` | `backtracking.js` | permutations, subsets, combinations, N-Queens, Sudoku, word search, parentheses |
| `strings/` | `pattern-matching.js` | naive, KMP, Rabin-Karp, Z-function, Horspool |
| | `string-problems.js` | palindromes (incl. Manacher), anagrams, longest unique substring, minimum window, Roman numerals |
| `math/` | `number-theory.js` | primes and sieve, factorisation, extended GCD, modular power/inverse, nCr, base conversion |
| `bit-manipulation/` | `bits.js` | popcount, XOR tricks, single number, Gray code, bitmask subsets |
| `divide-and-conquer/` | `divide-and-conquer.js` | quickselect, inversion count, closest pair, Karatsuba, Tower of Hanoi, merge k lists |

`algorithms/euclid-gcd.js`, `algorithms/lcm.js` and `Strings/` are the original exercises and are unchanged.

## Conventions

* ES modules (`export` / `import`), compiled by Babel for Jest; 2-space indent, single quotes, semicolons.
* Functions are pure and do not mutate their arguments unless the name or comment says so.
* Each file lists time and space complexity in comments, so the code doubles as a reference.
