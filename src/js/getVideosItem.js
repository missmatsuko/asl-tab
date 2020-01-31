import vars from './vars.js';
import checkVideosItem from './checkVideosItem.js';
import getRandomNumberInRange from './getRandomNumberInRange.js';

// Gets a random item from videos data with playing time less than vars.maxVideoDuration
const getVideosItem = function() {
  const videosDataLength = vars.videosData.length;
  let videosItem = undefined;
  let rollCount = 0;

  while (true) {
    const videoIndex = getRandomNumberInRange(0, videosDataLength - 1);
    videosItem = vars.videosData[videoIndex];
    rollCount++;

    if (rollCount > vars.maxRollCount || checkVideosItem(videosItem)) {
      break;
    }
  }

  localStorage.setItem(videosItem.id, Date.now());
  return videosItem;
}

export default getVideosItem;
