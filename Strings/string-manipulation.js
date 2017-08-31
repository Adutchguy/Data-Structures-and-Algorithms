'use strict';

export const reverseStringWordCharacters = function(string) {

  // check that the argument passed into the string parameter is in fact a string and return a new error message if it is not.
  if(typeof string === 'string') {
    // create a variable named words with an empty array assigned to it.
    let words = [];

    // split the individual words from the string argument and assign them to an array which is assigned to the variable words.
    words = string.split(' ');

    // create a placeholder variable for the modified sentence and assign an empty string to it.
    let invertedSentence = '';

    // iterate through the words array
    for (let i = 0; i < words.length ; i++){

      //  assign the word coresponding to the i index of the words array to the variable word.
      let word = words[i];

      // create a placeholder variable for the modified word and assign an empty string to it.
      let invertedWord = '';

      // iterate backwards through the word that was assigned to the variable word.
      for (let i = word.length - 1; i >= 0; i--)

        // add and assign each letter of the word being iterated to the variable invertedWord.
        invertedWord += word[i];

      // add and assign each inverted word corresponding to the current i index of the words array to the invertedSentence variable;
      invertedSentence += invertedWord;

      // add a space after every inverted word.
      invertedSentence += ' ';
    }

    // return the resulting inverted sentance from the function.
    return invertedSentence.trim();
  } else{
    return new Error('\nError: \nMust pass in a string as the argument to the "reverseStringWordCharacters" function.');
  }
};
