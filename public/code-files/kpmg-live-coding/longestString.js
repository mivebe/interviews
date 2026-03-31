// Assignment Description
// Implement a function longestString(items) that accepts an array of mixed-type values
// and returns the longest string found within it.
// Non-string values must be ignored, including arrays, booleans, numbers, and objects.

function longestString(items) {
  let prev = 0;
  let longest = '';

  for (let i = 0; i < items.length; i++) {
    if (typeof items[i] === 'string' && items[i].length > prev) {
      prev = items[i].length;
      longest = items[i];
    }
  }
  return longest;
}
