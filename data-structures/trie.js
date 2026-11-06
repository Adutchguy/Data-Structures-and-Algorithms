'use strict';

/**
 * Trie (prefix tree)
 *
 * Each edge is a character, and a path from the root spells a prefix. Words
 * that share a prefix share the nodes for it. Lookup cost depends on the length
 * of the word (L), not on how many words are stored.
 *
 * Uses: autocomplete, spell checking, IP routing, word games, prefix counting.
 *
 * Complexity: insert / search / startsWith / remove are O(L).
 */

class TrieNode {
  constructor() {
    this.children = new Map();
    this.isWord = false;
    this.prefixCount = 0; // how many stored words pass through this node
  }
}

export default class Trie {
  constructor() {
    this.root = new TrieNode();
    this._size = 0;
  }

  static fromWords(words) {
    const trie = new Trie();
    words.forEach(word => trie.insert(word));
    return trie;
  }

  get size() {
    return this._size;
  }

  insert(word) {
    if (this.search(word)) return false;
    let node = this.root;
    node.prefixCount++;
    for (const ch of word) {
      if (!node.children.has(ch)) node.children.set(ch, new TrieNode());
      node = node.children.get(ch);
      node.prefixCount++;
    }
    node.isWord = true;
    this._size++;
    return true;
  }

  // Is this exact word stored?
  search(word) {
    const node = this._find(word);
    return !!node && node.isWord;
  }

  // Does any stored word begin with this prefix?
  startsWith(prefix) {
    return this._find(prefix) !== null;
  }

  // How many stored words begin with this prefix?
  countWithPrefix(prefix) {
    const node = this._find(prefix);
    return node ? node.prefixCount : 0;
  }

  // Autocomplete: every stored word starting with `prefix`, alphabetically.
  wordsWithPrefix(prefix) {
    const start = this._find(prefix);
    if (!start) return [];
    const results = [];
    const walk = (node, path) => {
      if (node.isWord) results.push(path);
      Array.from(node.children.keys()).sort().forEach(ch => walk(node.children.get(ch), path + ch));
    };
    walk(start, prefix);
    return results;
  }

  // Remove a word and prune any nodes that no longer lead to a word.
  remove(word) {
    if (!this.search(word)) return false;
    let node = this.root;
    node.prefixCount--;
    const path = [];
    for (const ch of word) {
      path.push([node, ch]);
      node = node.children.get(ch);
      node.prefixCount--;
    }
    node.isWord = false;
    for (let i = path.length - 1; i >= 0; i--) {
      const [parent, ch] = path[i];
      if (parent.children.get(ch).prefixCount === 0) parent.children.delete(ch);
    }
    this._size--;
    return true;
  }

  _find(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }
}
