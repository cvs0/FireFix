// Initialize isEnabled to false
let isEnabled = false;

// Call toggleFireFix to set the initial state
toggleFireFix(isEnabled);

// Add a click event listener for the browser action
browser.browserAction.onClicked.addListener(handleClick);

// Intercept and block requests to tracking domains
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;

    // Check if the request is to a tracking domain
    if (isTrackingDomain(url)) {
      // Block the request
      return { cancel: true };
    }

    // Allow the request to proceed
    return { cancel: false };
  },
  { urls: ["<all_urls>"] }, // Match all URLs
  ["blocking"]
);

// List of known tracking domains (add more as needed)
const trackingDomains = [
  "grabify.link",
  // Add other tracking domains here
];

/**
 * Check if a URL matches any tracking domain.
 * @param {string} url - The URL to check.
 * @returns {boolean} True if the URL matches a tracking domain, false otherwise.
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
 * Toggle the FireFix feature on or off.
 * @param {boolean} enable - True to enable, false to disable.
 */
function toggleFireFix(enable = true) {
  // Enable or disable peerConnection
  browser.privacy.network.peerConnectionEnabled.set({ value: enable });

  // Set webRTCIPHandlingPolicy to 'default' if enabled, 'disable_non_proxied_udp' if disabled
  browser.privacy.network.webRTCIPHandlingPolicy.set({ value: enable ? 'default' : 'disable_non_proxied_udp' });

  // Set the browser action title based on the state
  const title = enable ? 'FireFix is enabled.' : 'FireFix is disabled.';
  browser.browserAction.setTitle({ title });

  // Set the icon path based on the state (unsafe or safe)
  const name = enable ? 'unsafe' : 'safe';
  const path = `images/${name}-64.png`;
  browser.browserAction.setIcon({ path });

  // Update the isEnabled variable to match the current state
  isEnabled = enable;
}

/**
 * Handle the click event for the browser action.
 */
function handleClick() {
  // Invert the current state when the browser action is clicked
  toggleFireFix(!isEnabled);
}
