import gcd from './euclid-gcd.js';

test('Returns 6 as the gcd', () => {
  expect(gcd(30,24)).toEqual(6);
});
