import els from './els.js';
import insertIframe from './insertIframe.js';

// Replaces iframe src so it stops autoplaying
// Workaround due to not being able to use YouTube iframe player API for Firefox
const stopAutoplay = function() {
  const iframe = els.iframeContainer.querySelector('iframe');
  const iframeSrc = iframe.src;
  const newIframeSrc = iframeSrc.replace('&autoplay=1', '');
  iframe.remove();
  insertIframe(newIframeSrc);
}

export default stopAutoplay;
