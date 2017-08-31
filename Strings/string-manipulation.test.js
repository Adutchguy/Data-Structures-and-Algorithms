'use strict';

import * as StringManipulation from './string-manipulation.js';

describe('Testing string-manipulation.js', () => {
  test('Should return a string with the characters of each word in the string that was passed into the function reversed.', () => {
    expect(StringManipulation.reverseStringWordCharacters('This is a string')).toEqual('sihT si a gnirts');
  });
  test('Should return an error message if anything other than a string is passed into the function.', () => {
    expect(StringManipulation.reverseStringWordCharacters(true)).toEqual(new Error('\nError: \nMust pass in a string as the argument to the "reverseStringWordCharacters" function.'));
  });
});
