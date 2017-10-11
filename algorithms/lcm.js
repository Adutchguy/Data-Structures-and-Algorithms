import gcd from './euclid-gcd.js';

export default function lcm(a,b) {
  let numer = a * b;
  let denom = gcd(a,b);
  return numer/denom;
}
