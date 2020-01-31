// Set variables
const vars = {
  maxVideoDuration: 10, // Max duration of videos to play, in seconds
  maxRollCount: 50, // Max times to reroll for random video
  repeatVideoDuration: 24 * 60 * 60 * 1000, // Min (ideal) duration before repeating a video, in milliseconds
  videosDataEndpoint: 'https://s3.ca-central-1.amazonaws.com/asl-tab-api-data/data.json',
  defaultIframeSrc: 'https://www.youtube.com/embed/playlist?list=UUZy9xs6Tn9vWqN_5l0EEIZA', // ASL signs playlist
  defaultIframeQueryString: 'autoplay=1&loop=1&mute=1&rel=0',
  defaultHeadingText: 'ASL Tab',
  videosData: [],
};

export default vars;
