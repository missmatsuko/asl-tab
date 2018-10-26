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

// Embed element
const embedElement = document.getElementById('youtube');

// Set up endpoint URL
const url = `${ENDPOINT_BASE_URL}?${ENDPOINT_PARAMS_ARRAY.join('&')}`;

// Make fetch request
fetch(url)
.then(response => response.json())
.then((data) => {
  if (data.items.length) {
    // Get the number of videos in the playlist
    const numVideos = data.items[0].contentDetails.itemCount;

    // Set embed to play random video within playlist range
    const randomVideoIndex = Math.floor(Math.random() * numVideos);
    embedElement.src += `&index=${ randomVideoIndex }`;
  }
})
.catch(error => console.error('Error:', error));
