// Global Variables
const MAX_VIDEO_DURATION = 10; // Max duration of videos to play, in seconds
const MAX_ROLL_COUNT = 50; // Max times to reroll for random video
const REPEAT_VIDEO_DURATION = 24 * 60 * 60 * 1000; // Min (ideal) duration before repeating a video, in milliseconds
const VIDEOS_DATA_ENDPOINT = 'https://s3.ca-central-1.amazonaws.com/asl-tab-api-data/data.json';
const DEFAULT_IFRAME_SRC = 'https://www.youtube.com/embed/playlist?list=UUZy9xs6Tn9vWqN_5l0EEIZA&rel=0&mute=1'; // ASL signs playlist
const DEFAULT_HEADING_TEXT = 'ASL Tab';

let videosData = [];

// DOM Elements
const iframeContainerEl = document.getElementById('iframe-container');
const headingEl = document.getElementById('heading');

// Gets a random number in a given range
const getRandomNumber = function(min = 0, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Updates heading element's text
const updateHeadingText = function(text) {
  headingEl.textContent = text;
}

// Inserts iframe into the iframeContainerEl
const insertIframe = function(src) {
  // Create an iFrame
  const iframe = document.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.allow = 'fullscreen';
  iframe.src = src;

  // Append it inside iframeContainerEl
  iframeContainerEl.appendChild(iframe);
}

// Replaces iframe src so it stops autoplaying
// Workaround due to not being able to use YouTube iframe player API for Firefox
const stopAutoplay = function() {
  const iframe = iframeContainerEl.querySelector('iframe');
  const iframeSrc = iframe.src;
  const newIframeSrc = iframeSrc.replace('&autoplay=1', '');

  if (iframeSrc !== newIframeSrc) {
    iframe.remove();
    insertIframe(newIframeSrc);
  }
}

// Gets fresh videos data, returns false otherwise
const getVideosData = async function() {
  const response = await fetch(VIDEOS_DATA_ENDPOINT);
  return response.ok ? response.json() : false;
}

// Check if video can be played
const checkVideosItem = function(videosItem) {

  // Check if duration is acceptable
  if (videosItem.duration > MAX_VIDEO_DURATION) {
    return false;
  }

  // Check if video has been recently played
  const videosItemLastPlayed = localStorage.getItem(videosItem.id);
  if (videosItemLastPlayed && Date.now() - videosItemLastPlayed < REPEAT_VIDEO_DURATION) {
    return false;
  }

  return true;
}

// Gets a random item from videos data with playing time less than MAX_VIDEO_DURATION
const getVideosItem = function() {
  const videosDataLength = videosData.length;
  let videosItem = undefined;
  let rollCount = 0;

  while (true) {
    const videoIndex = getRandomNumber(0, videosDataLength - 1);
    videosItem = videosData[videoIndex];
    rollCount++;

    if (rollCount > MAX_ROLL_COUNT || checkVideosItem(videosItem)) {
      break;
    }
  }

  localStorage.setItem(videosItem.id, Date.now());
  return videosItem;
}

// Main program
const init = async function() {
  // Set fallback iframe src and heading text
  let newIframeSrc = DEFAULT_IFRAME_SRC;
  let newHeadingText = DEFAULT_HEADING_TEXT;

  // Get videos data
  videosData = await getVideosData();

  if (videosData.length) {
    // Embed a random video from the entire playlist
    const videosItem = getVideosItem();
    const videoId = videosItem.id;
    const videoTitle = videosItem.title;

    // NOTE: playlist param set to video ID to enable looping as looping is only enabled on playlist embeds and this magically makes it into a valid playlist
    newIframeSrc = `https://www.youtube.com/embed/${ videoId }?&playlist=${ videoId }&loop=1&autoplay=1&mute=1`;
    newHeadingText = videoTitle;
  } else {
    // Embed a random video from the latest 100 items of the playlist
    // 100 is the actual amount of videos expected in the playlist
    const videoIndex = getRandomNumber(0, 100);
    newIframeSrc = `${ DEFAULT_IFRAME_SRC }&index=${ videoIndex }&autoplay=1&mute=1`;
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
