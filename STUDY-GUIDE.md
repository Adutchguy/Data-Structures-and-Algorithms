# Study Guide

A companion to [`big-O-rules.md`](big-O-rules.md): complexity tables for the data structures and algorithms in this repo, plus a quick way to pick a technique.

## Growth rates, slowest-growing first

| Class | Name | Typical example |
| --- | --- | --- |
| O(1) | constant | array index, hash lookup (average) |
| O(log n) | logarithmic | binary search, balanced-tree lookup |
| O(n) | linear | scan, BFS/DFS on a tree |
| O(n log n) | linearithmic | merge sort, heap sort, sorting-based solutions |
| O(n²) | quadratic | nested loops, insertion sort, edit-distance table |
| O(2ⁿ) | exponential | subsets, naive recursive Fibonacci |
| O(n!) | factorial | permutations, brute-force travelling salesman |

Rough budget: n ≤ 10 allows n!, n ≤ 20–25 allows 2ⁿ, n ≤ 5,000 allows n², n ≤ 10⁶ wants n log n or better.

## Data structure operations

| Structure | Access | Search | Insert | Delete | Notes |
| --- | --- | --- | --- | --- | --- |
| Array | O(1) | O(n) | O(n) | O(n) | push at end is amortised O(1) |
| Linked list | O(n) | O(n) | O(1) at a known node/head | O(1) at a known node | no random access |
| Stack / Queue / Deque | – | O(n) | O(1) | O(1) | only the ends are reachable |
| Hash table | – | O(1) avg, O(n) worst | O(1) avg | O(1) avg | worst case: all keys collide |
| Binary search tree | – | O(h) | O(h) | O(h) | h = n if unbalanced |
| AVL tree | – | O(log n) | O(log n) | O(log n) | rotations keep h ≤ ~1.44 log n |
| Heap | O(1) min/max | O(n) | O(log n) | O(log n) | build from array in O(n) |
| Trie | – | O(L) | O(L) | O(L) | L = key length |
| Union-find | – | ~O(α(n)) | – | – | near-constant with compression + rank |
| Fenwick tree | – | – | O(log n) update | – | prefix query O(log n) |
| Segment tree | – | – | O(log n) update | – | range query O(log n); lazy range update O(log n) |
| Sparse table | – | – | – | – | O(n log n) build, O(1) range-min query, static data only |
| Skip list | – | O(log n) exp. | O(log n) exp. | O(log n) exp. | randomised levels |
| LRU cache | – | O(1) | O(1) | O(1) | hash map + doubly linked list |
| Bloom filter | – | O(k) | O(k) | not supported | false positives possible, never false negatives |

## Sorting

| Algorithm | Best | Average | Worst | Space | Stable |
| --- | --- | --- | --- | --- | --- |
| Bubble | O(n) | O(n²) | O(n²) | O(1) | yes |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | no |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | yes |
| Shell | O(n log n) | depends on gaps | O(n²) | O(1) | no |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | yes |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | no |
| Heap | O(n log n) | O(n log n) | O(n log n) | O(1) | no |
| Counting | O(n + k) | O(n + k) | O(n + k) | O(k) | yes |
| Radix | O(d(n + b)) | O(d(n + b)) | O(d(n + b)) | O(n + b) | yes |
| Bucket | O(n + k) | O(n + k) | O(n²) | O(n) | depends on inner sort |

## Graph algorithms (V vertices, E edges)

| Algorithm | Time | Use it when |
| --- | --- | --- |
| BFS | O(V + E) | fewest edges in an unweighted graph |
| DFS | O(V + E) | components, cycles, topological order |
| Dijkstra (binary heap) | O((V + E) log V) | single-source shortest paths, no negative weights |
| Bellman-Ford | O(VE) | negative weights, detects negative cycles |
| Floyd-Warshall | O(V³) | all pairs, small V |
| A* | depends on heuristic | single target with a good estimate |
| Kruskal | O(E log E) | minimum spanning tree on a sparse graph |
| Prim (heap) | O(E log V) | minimum spanning tree on a dense graph |
| Tarjan / Kosaraju | O(V + E) | strongly connected components |
| Bridges / articulation points | O(V + E) | single points of failure |
| Edmonds-Karp | O(VE²) | maximum flow / bipartite matching |
| Topological sort | O(V + E) | ordering a DAG (dependencies) |

## Which technique?

| The problem says... | Try |
| --- | --- |
| sorted array, find a pair or a value | binary search, two pointers |
| longest/shortest contiguous subarray or substring | sliding window |
| many range sums | prefix sums (static), Fenwick tree (updates) |
| range min/max queries | sparse table (static), segment tree (updates) |
| next greater/smaller element, histogram | monotonic stack |
| top k, median of a stream, repeated min/max | heap |
| have I seen this before, count frequencies | hash map / set |
| prefix lookups, autocomplete | trie |
| connected groups, merging sets | union-find |
| shortest path | BFS, Dijkstra, Bellman-Ford |
| dependencies, ordering | topological sort |
| count ways / min cost / max value with overlapping subproblems | dynamic programming |
| locally best choice is provably safe (intervals, scheduling) | greedy |
| generate all combinations, permutations, placements | backtracking |
| split in halves and combine | divide and conquer |
| minimise the maximum / maximise the minimum | binary search on the answer |
| "in place", O(1) extra space on a linked structure | fast/slow pointers |

## Dynamic programming recipe

1. Define the state in words: "dp[i][j] is the best answer using the first i items and capacity j".
2. Write the recurrence that builds a state from smaller ones.
3. Set the base cases.
4. Choose the fill order (top-down with memo, or bottom-up).
5. Shrink the table if each row only needs the previous one.

## Backtracking recipe

Choose, explore, un-choose: add an option to the current path, recurse, then remove it. Prune as soon as a partial path cannot lead to a solution (N-Queens attack checks, combination sums that exceed the target).
