import vars from './src/js/vars.js';
import els from './src/js/els.js';

import getRandomNumberInRange from './src/js/getRandomNumberInRange.js';
import getVideosData from './src/js/getVideosData.js';
import getVideosItem from './src/js/getVideosItem.js';
import insertIframe from './src/js/insertIframe.js';
import stopAutoplay from './src/js/stopAutoplay.js';
import updateHeadingText from './src/js/updateHeadingText.js';

// Main program
const init = async function() {
  // Set fallback iframe src and heading text
  let newIframeSrc = vars.defaultIframeSrc;
  let newHeadingText = vars.defaultHeadingText;

  // Get videos data
  vars.videosData = await getVideosData();

  if (vars.videosData.length) {
    // Embed a random video from the entire playlist
    const videosItem = getVideosItem();
    const videoId = videosItem.id;
    const videoTitle = videosItem.title;

    // NOTE: playlist param set to video ID to enable looping as looping is only enabled on playlist embeds and this magically makes it into a valid playlist
    newIframeSrc = `https://www.youtube.com/embed/${ videoId }?&playlist=${ videoId }&${ vars.defaultIframeQueryString }`;
    newHeadingText = videoTitle;
  } else {
    // Embed a random video from the latest 100 items of the playlist
    // 100 is the actual amount of videos expected in the playlist
    const videoIndex = getRandomNumberInRange(0, 100);
    newIframeSrc = `${ vars.defaultIframeSrc }&index=${ videoIndex }&${ vars.defaultIframeQueryString }`;
  }

  // Insert the iFrame into page
  insertIframe(newIframeSrc);

  // Update heading text
  updateHeadingText(newHeadingText);

  // Stop playing video when document is hidden, or when 1 minute passes
  window.addEventListener('visibilitychange', (e) => {
    if (document.hidden) {
      stopAutoplay();
    }
  });

  setTimeout(stopAutoplay, 60 * 1000);
}

// Run the program
init();
