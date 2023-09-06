let isEnabled = false;
toggleFireFix(isEnabled);

browser.browserAction.onClicked.addListener(handleClick);

function toggleFireFix(enable = true) {
  browser.privacy.network.peerConnectionEnabled.set({ value: enable });
  browser.privacy.network.webRTCIPHandlingPolicy.set({ value: enable ? 'default' : 'disable_non_proxied_udp' });
  
  const title = enable ?
    'WebRTC is NOT disabled. Be careful.' :
    'WebRTC is disabled.';
  browser.browserAction.setTitle({ title });

  const name = enable ? 'unsafe' : 'safe';
  const path = `images/${name}-64.png`;

  browser.browserAction.setIcon({ path });
}

function handleClick() {
  toggleFireFix(!isEnabled);
}