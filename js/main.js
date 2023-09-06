// TODO: Define and maintain an up-to-date list of tracking domains.
const trackingDomains = [
  "grabify.link",
  "clicky.com",
  "doubleclick.net",
  "google-analytics.com",
  "criteo.com",
  "scorecardresearch.com",
  "quantserve.com",
  "bluekai.com",
  "outbrain.com",
  "taboola.com",
  "sharethis.com",
  "addthis.com",
  "chartbeat.com",
  "omtrdc.net",
  "rubiconproject.com",
  "openx.net",
  "pubmatic.com",
  "taboola.net",
  "adnxs.com",
  "krxd.net",
  "nexac.com",
  "liveramp.com",
  "serving-sys.com",
  "zedo.com",
  "adform.com",
  "mathtag.com",
  "yieldlab.net",
  "rlcdn.com",
  "adriver.ru",
  "googletagmanager.com",
  "zamanta.net",
];

// initialize isEnabled to false
let isEnabled = false;

// call toggleFireFix to set the initial state
toggleFireFix(isEnabled);

// add a click event listener for the browser action
browser.browserAction.onClicked.addListener(handleClick);

/**
 * intercept and block requests to known tracking domains.
 * @param {object} details - Request details.
 */
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;

    // check if the request is to a tracking domain
    if (isTrackingDomain(url)) {
      // block the request
      return { cancel: true };
    }

    // allow the request to proceed
    return { cancel: false };
  },
  { urls: ["<all_urls>"] }, // match all URLs
  ["blocking"]
);

/**
 * check if a URL matches any known tracking domain.
 * @param {string} url - the URL to check.
 * @returns {boolean} true if the URL matches a tracking domain, false otherwise.
 */
function isTrackingDomain(url) {
  for (const domain of trackingDomains) {
    if (url.includes(domain)) {
      return true;
    }
  }
  return false;
}

/**
 * toggle the FireFix feature on or off.
 * @param {boolean} enable - true to enable, false to disable.
 */
function toggleFireFix(enable = true) {
  // enable or disable peerConnection
  browser.privacy.network.peerConnectionEnabled.set({ value: enable });

  // set webRTCIPHandlingPolicy to 'default' if enabled, 'disable_non_proxied_udp' if disabled
  browser.privacy.network.webRTCIPHandlingPolicy.set({ value: enable ? 'default' : 'disable_non_proxied_udp' });

  // set the browser action title based on the state
  const title = enable ? 'FireFix is enabled.' : 'FireFix is disabled.';
  browser.browserAction.setTitle({ title });

  // set the icon path based on the state (unsafe or safe)
  const name = enable ? 'unsafe' : 'safe';
  const path = `images/${name}-64.png`;
  browser.browserAction.setIcon({ path });

  // update the isEnabled variable to match the current state
  isEnabled = enable;
}

/**
 * handle the click event for the browser action.
 */
function handleClick() {
  // invert the current state when the browser action is clicked
  toggleFireFix(!isEnabled);
}
