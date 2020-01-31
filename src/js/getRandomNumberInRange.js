// Gets a random number in a given range
const getRandomNumberInRange = function(min, max) {

  // Check if min and max are numbers
  if (!(typeof min === 'number' && typeof min === 'number')) {
    console.error('Must give min and max values for function `getRandomNumberInRange`.');
    return;
  }

  // Return random number in range of min and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;

}

export default getRandomNumberInRange;
