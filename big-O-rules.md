# Big O Rules

1. If an algorithm performs f(N) steps, then it is O(f(N)).
2. If an algorithm performs f(N) steps followed by g(N) steps, then it is O(f(N) + g(N)).
3. if f(N) > g(N) for large N, then O(f(N) + g(N)) = O(f(N)).
4. If an algorithm performs g(N) steps for each of f(N) steps, then it is O(f(N)xg(N)).
5. Ignore constant mutiples: O(Cxf(N)) = O(f(N)) O(f(CxN)) = O(f(N)).
