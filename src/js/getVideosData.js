import vars from './vars.js';

// Gets fresh videos data, returns false otherwise
const getVideosData = async function() {
  const response = await fetch(vars.videosDataEndpoint);
  return response.ok ? response.json() : false;
}

export default getVideosData;
