// Constants
const YOUTUBE_API_KEY = 'AIzaSyCdZdNVQ6XbhA1AQQ1ZDK1qZCXitP6RPOA';
const PLAYLIST_ID = 'UUZy9xs6Tn9vWqN_5l0EEIZA';
const ENDPOINT_BASE_URL = 'https://www.googleapis.com/youtube/v3/playlists';
const ENDPOINT_PARAMS = {
  'key': YOUTUBE_API_KEY,
  'id': PLAYLIST_ID,
  'part': 'contentDetails',
};

const ENDPOINT_PARAMS_ARRAY = Object.entries(ENDPOINT_PARAMS).map(([key, value]) => {
  return `${key}=${encodeURIComponent(value)}`;
});

// iframe element
const iframeId = 'iframe';
const iframeElement = document.getElementById(iframeId);

// Set up endpoint URL
const url = `${ENDPOINT_BASE_URL}?${ENDPOINT_PARAMS_ARRAY.join('&')}`;

// Make fetch request
fetch(url)
.then(response => response.json())
.then((data) => {
  if (data.items.length) {
    // Get the number of videos in the playlist
    const numVideos = data.items[0].contentDetails.itemCount;

    // Set iframe to play random video within playlist range
    const randomVideoIndex = Math.floor(Math.random() * numVideos);
    iframeElement.src += `&index=${ randomVideoIndex }`;

    setTimeout(() => {
      // Change playlist iframe to single video iframe
      youtubeIframeApiPromise.then(() => {
        const player = new YT.Player(iframeId, {
          events: {
            onReady: () => {
              // Change playlist iframe to single video iframe
              const videoUrl = player.getVideoUrl();
              const parsedVideoUrl = new URL(videoUrl);
              const videoId = parsedVideoUrl.searchParams.get('v');

              player.loadVideoById(videoId);
              player.playVideo();
            },
            onStateChange: (event) => {
              // Fake loop the video
              if (event.data === YT.PlayerState.ENDED) {
                player.playVideo();
              }
            }
          }
        });
      });
    });

  }
})
.catch(error => console.error('Error:', error));

// Create promise for onYouTubeIframeAPIReady
const youtubeIframeApiPromise = new Promise((resolve, reject) => {
  window.onYouTubeIframeAPIReady = function() {
    resolve();
    delete window.onYouTubeIframeAPIReady;
  }
});
