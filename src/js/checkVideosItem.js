import vars from './vars.js';

// Check if video can be played
const checkVideosItem = function(videosItem) {

  // Check if duration is acceptable
  if (videosItem.duration > vars.maxVideoDuration) {
    return false;
  }

  // Check if video has been recently played
  const videosItemLastPlayed = localStorage.getItem(videosItem.id);
  if (videosItemLastPlayed && Date.now() - videosItemLastPlayed < vars.repeatVideoDuration) {
    return false;
  }

  return true;
}

export default checkVideosItem;
