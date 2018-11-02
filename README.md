# asl-tab
Chrome extension that loads a random ASL instructional video in new tabs. Content from [ASLU Signs YouTube Channel](https://www.youtube.com/channel/UCZy9xs6Tn9vWqN_5l0EEIZA).

### Download the ASL Tab browser extension:
- [Chrome](https://chrome.google.com/webstore/detail/asl-tab/bjiakmejoofpfclmopcfpkopmamecnkd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/asl-tab/)

### Thanks
- Dr. Bill Vicars of ASLU (LifePrint) for content - [YouTube](https://www.youtube.com/user/billvicars), [Website](http://lifeprint.com/)
- [Bart Nagel (@tremby)](https://github.com/tremby) for code helps

### Roadmap
- [x] Publish the Chrome extension
- [ ] Port extension to other browsers:
  - [x] FireFox
  - [ ] Edge (maybe)
- [ ] Add server-side component:
  - [ ] Hide API key
  - [ ] Reduce client-side YouTube Data API calls
  - [ ] Stop using the playlist position undocumented workaround (hack)
  - [ ] Store video IDs and titles for valid videos (short duration, available on YouTube)
  - [ ] Update video IDs and titles periodically (new videos) and when they're consistently unreachable (deleted)
- [ ] User settings (maybe)
  - [ ] Max video duration
  - [ ] Min time until video can repeat
  - [ ] Use own API key
  - [ ] (Don't) loop video
  - [ ] (Don't) autoplay video
