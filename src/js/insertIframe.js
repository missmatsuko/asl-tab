import els from './els.js';

// Inserts iframe into the iframe container el
const insertIframe = function(src) {
  // Create an iFrame
  const iframe = document.createElement('iframe');
  iframe.frameBorder = 0;
  iframe.allow = 'fullscreen';
  iframe.src = src;

  // Append it inside iframe container el
  els.iframeContainer.appendChild(iframe);
}

export default insertIframe;
