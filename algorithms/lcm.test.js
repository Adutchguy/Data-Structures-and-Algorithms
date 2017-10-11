import lcm from './lcm.js';

test('should return 60', () => {
  expect(lcm(12,15)).toEqual(60);
});
