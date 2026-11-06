'use strict';

import { hashString } from './hash-table.js';

/**
 * Bloom Filter
 *
 * A compact, probabilistic set. It can answer:
 *   mightContain(x) === false  -> x is DEFINITELY not in the set
 *   mightContain(x) === true   -> x is PROBABLY in the set (false positives happen)
 * It never produces false negatives, uses far less memory than storing the
 * items, and cannot delete. Uses: skipping disk lookups for missing keys,
 * spell checkers, "have I crawled this URL?" checks, malicious-URL lists.
 *
 * How it works: a bit array of m bits and k hash functions. add(x) sets the k
 * bits that x hashes to; mightContain(x) checks that all k bits are set.
 *
 * Sizing for n expected items and target false-positive rate p:
 *     m = -n * ln(p) / (ln 2)^2        k = (m / n) * ln 2
 * The k indices come from "double hashing": index_i = (h1 + i * h2) mod m.
 */

// FNV-1a 32-bit hash.
function fnv1a(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash;
}

export default class BloomFilter {
  constructor(expectedItems = 1000, falsePositiveRate = 0.01) {
    const ln2 = Math.LN2;
    this.bitCount = Math.max(8, Math.ceil(-expectedItems * Math.log(falsePositiveRate) / (ln2 * ln2)));
    this.hashCount = Math.max(1, Math.round((this.bitCount / expectedItems) * ln2));
    this._bits = new Uint8Array(Math.ceil(this.bitCount / 8));
  }

  _indices(item) {
    const str = String(item);
    const h1 = hashString(str);
    const h2 = fnv1a(str) | 1; // odd, so successive probes differ
    const indices = [];
    for (let i = 0; i < this.hashCount; i++) {
      indices.push(((h1 + i * h2) >>> 0) % this.bitCount);
    }
    return indices;
  }

  add(item) {
    this._indices(item).forEach(bit => {
      this._bits[bit >> 3] |= 1 << (bit & 7);
    });
    return this;
  }

  mightContain(item) {
    return this._indices(item).every(bit => (this._bits[bit >> 3] & (1 << (bit & 7))) !== 0);
  }
}
