// Global Variables
const YOUTUBE_API_KEY = 'AIzaSyCdZdNVQ6XbhA1AQQ1ZDK1qZCXitP6RPOA';
const PLAYLIST_ID = 'UUZy9xs6Tn9vWqN_5l0EEIZA';
const MAX_VIDEO_DURATION = 10; // Max duration of videos to play, in seconds
const STORED_NUM_VIDEOS_DURATION = 7 * 24 * 60 * 60; // Duration to store number of videos in playlist; 7 days, in seconds
const STORED_VIDEO_POSITION_DURATION = 1 * 24 * 60 * 60; // Duration to store video position; 1 day, in seconds
const IFRAME_ID = 'iframe';
const NUM_VIDEOS_IN_PLAYLIST_EMBED = 100; // Number of videos that are supposed to be in an embedded playlist

let player = null;
let numVideos = NUM_VIDEOS_IN_PLAYLIST_EMBED; // Number of videos available to randomize from

// DOM Elements
let iFrameElement = document.getElementById(IFRAME_ID);
const iFrameWrapperElement = document.getElementById('iframe-wrapper');
const pageHeading = document.getElementById('pageHeading');

/*
  Given a base URL and an object of query parameters as key/value pairs,
  returns a composed query parameter URL
*/
const composeEndpointUrl = function(baseUrl, queryParams) {
  const queryParamsArray = Object.entries(queryParams).map(([key, value]) => {
    return `${key}=${encodeURIComponent(value)}`;
  });
  return `${baseUrl}?${queryParamsArray.join('&')}`;
}

// Returns true if the video is valid
const checkVideo = function() {
  const parsedIframeUrl = new URL(iFrameElement.src);
  const iframeVideoIndex = parseInt(parsedIframeUrl.searchParams.get('index'), 10);
  const playerVideoIndex = player.getPlaylistIndex();
  const videoDuration = player.getDuration(); // seconds

  if (videoDuration > MAX_VIDEO_DURATION) {
    return false;
  }

  // If the videoIndex doesn't match randomVideoIndex, try a different video within 100 (thinking it means the getting a video outside of NUM_VIDEOS_IN_PLAYLIST_EMBED hack stopped working)
  if (iframeVideoIndex !== playerVideoIndex) {
    numVideos = NUM_VIDEOS_IN_PLAYLIST_EMBED;
    return false;
  }

  return true;
}

// Get a random video position (1-indexed)
const getRandomVideoPosition = function() {
  const randomVideoPosition = Math.floor(Math.random() * numVideos);
  const storedVideoPositionDate = localStorage.getItem(randomVideoPosition);
  const storedVideoPositionExpired = Date.now() - storedVideoPositionDate > STORED_VIDEO_POSITION_DURATION;

  // Re-roll once if the video position is not expired
  if (!storedVideoPositionExpired) {
    return Math.floor(Math.random() * numVideos);
  } else {
    localStorage.setItem(randomVideoPosition, Date.now());
    return randomVideoPosition;
  }
}

/*
  Plays a random video
  NOTE: There is a method in the IFrame Player API to set the playlist position,
  but that doesn't allow setting a position beyond NUM_VIDEOS_IN_PLAYLIST_EMBED
  REF: https://developers.google.com/youtube/iframe_api_reference#playVideoAt
*/
const playRandomVideo = async function() {
  let randomVideoIndex = getRandomVideoPosition() - 1;

  const iFrameSrc = iFrameElement.src;

  if (player) {
    player.destroy();

    // Recreate IFrame
    iFrameElement = document.createElement('iframe');

    // Add default attributes
    iFrameElement.src = iFrameSrc;
    iFrameElement.id = IFRAME_ID;
    iFrameElement.frameBorder = 0;
    iFrameElement.allow = 'fullscreen';

    iFrameWrapperElement.appendChild(iFrameElement);
  }

  // Set index query parameter of iFrameElement
  const parsedIframeUrl = new URL(iFrameSrc);
  parsedIframeUrl.searchParams.set('index', randomVideoIndex);
  iFrameElement.src = parsedIframeUrl.href;

  // Wait for iframe src to update
  await new Promise((resolve, reject) => {
    setTimeout(resolve);
  });

  // Ensure YouTube IFrame API is ready
  await youtubeIframeApiPromise;

  // Create player instance from YouTube IFrame embed
  return new Promise((resolve, reject) => {
    player = new YT.Player(IFRAME_ID, {
      events: {
        onReady: async () => {
          // Check if video is good
          if (checkVideo()) {
            // Get info of currently playing video
            const videoUrl = player.getVideoUrl();
            const parsedVideoUrl = new URL(videoUrl);
            const videoId = parsedVideoUrl.searchParams.get('v');

            // Change playlist embed into a single video embed
            player.loadVideoById(videoId);

            player.playVideo();

            // Update title and heading text
            fetch(
              composeEndpointUrl(
                'https://www.googleapis.com/youtube/v3/videos',
                {
                  'key': YOUTUBE_API_KEY,
                  'part': 'snippet',
                  'id': videoId,
                }
              )
            )
            .then(response => response.json())
            .then((data) => {
              if (data.items.length) {
                const videoTitle = data.items[0].snippet.title;
                document.title += ` | ${ videoTitle }`;
                pageHeading.textContent = videoTitle;
              }
            })
            .catch(error => console.error('Error:', error));
          } else {
            // Randomize again
            await playRandomVideo();
          }

          resolve();
        },
        onStateChange: (event) => {
          // Fake loop the video
          // NOTE: Playlists can be looped via YouTube API, but single videos cannot
          if (event.data === YT.PlayerState.ENDED) {
            player.playVideo();
          }
        }
      }
    });
  });

}

// Create promise for onYouTubeIframeAPIReady
const youtubeIframeApiPromise = new Promise((resolve, reject) => {
  window.onYouTubeIframeAPIReady = function() {
    resolve();
    delete window.onYouTubeIframeAPIReady;
  }
});

const updateNumVideos = function() {
  const storedNumVideos = localStorage.getItem('NUM_VIDEOS');
  const storedNumVideosDate = localStorage.getItem('NUM_VIDEOS_DATE');
  const storedNumVideosExpired = Date.now() - storedNumVideosDate > STORED_NUM_VIDEOS_DURATION;

  if (!storedNumVideosExpired && storedNumVideos >= NUM_VIDEOS_IN_PLAYLIST_EMBED) {
    // Use the value from LocalStorage
    numVideos = storedNumVideos;
  } else {
    // Use the actual number of videos in playlist
    fetch(
      composeEndpointUrl(
        'https://www.googleapis.com/youtube/v3/playlists',
        {
          'key': YOUTUBE_API_KEY,
          'id': PLAYLIST_ID,
          'part': 'contentDetails',
        }
      )
    )
    .then(response => response.json())
    .then((data) => {
      if (data.items.length) {
        numVideos = data.items[0].contentDetails.itemCount;
        localStorage.setItem('NUM_VIDEOS', numVideos);
        localStorage.setItem('NUM_VIDEOS_DATE', Date.now());
      }
    })
    .catch(error => console.error('Error:', error));
  }
}

// Main JS
updateNumVideos();
playRandomVideo();
