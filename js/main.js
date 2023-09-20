// TODO: Define and maintain an up-to-date list of tracking domains.
const trackingDomains = [

  //----------------------MISC TRACKING LINKS-----------------------//

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

  //----------------------------------------------------------------//

  //--------------------------GRABIFY LINKS-------------------------//

  "grabify.link",
  "photovault.pics",
  "bathtub.pics",
  "foot.wiki",
  "thisdomainislong.lol",
  "gamergirl.pro",
  "picshost.pics",
  "pichost.pics",
  "gamertag.shop",
  "imghost.pics",
  "imagehost.pics",
  "toldyouso.lol",
  "toldyouso.pics",
  "screenshare.pics",
  "myprivate.pics",
  "noodshare.pics",
  "cheapcinema.club",
  "shhh.lol",
  "partpicker.shop",
  "sportshub.bar",
  "locations.quest",
  "lovebird.guru",
  "trulove.guru",
  "dateing.club",
  "shrekis.life",
  "gaming-at-my.best",
  "screenshot.best",
  "gamingfun.me",
  "catsnthing.com",
  "catsnthings.fun",
  "joinmy.site",
  "fortnitechat.site",
  "fortnight.space",
  "stopify.co",

  //----------------------------------------------------------------//
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
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;

    // Check if the request is to a tracking domain, and block it if true
    if (isTrackingDomain(url)) {
      return { cancel: true };
    }

    // Allow the request to proceed
    return { cancel: false };
  },
  { urls: ["<all_urls>"] }, // Match all URLs
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
  const path = {
    "16": `images/${name}-16.png`,
    "48": `images/${name}-48.png`,
    "128": `images/${name}-128.png`
  };
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