let intervalId = null;

function runScriptOnMatchingTabs() {
  chrome.tabs.query({ url: "*://*.example.com/*" }, (tabs) => {
	for (const tab of tabs) {
		chrome.scripting.executeScript({
			target: { tabId: tab.id },
			func: () => {
				// 👇 Delay to ensure page and JS is fully loaded
				setTimeout(() => {
				if (typeof ExtendSession === 'function') {
					ExtendSession();
					console.log("✅ ExtendSession called");
				} else {
					console.warn("⚠️ ExtendSession is not defined");
				}
				}, 2000); // wait 2 seconds
			}
		});
	}
  });
}

function updateBadge(enabled) {
  if (enabled) {
	chrome.action.setBadgeText({ text: 'ON' });
	chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' }); // green
  } else {
	chrome.action.setBadgeText({ text: 'OFF' });
	chrome.action.setBadgeBackgroundColor({color: '#99A1AF'});
  }
}


function setupInterval(enabled) {
  if (intervalId) clearInterval(intervalId);
  const baseInterval = 5 * 60 * 1000;
  const variance = 3 * 60 * 1000;
  const offset = Math.floor(Math.random() * (variance * 2)) - variance;
  updateBadge(enabled);
  if (enabled) {
	intervalId = setInterval(runScriptOnMatchingTabs, baseInterval + offset); // every 5 minutes
	runScriptOnMatchingTabs(); // run immediately
  }
}

// Monitor toggle changes
chrome.storage.onChanged.addListener((changes) => {
  if ('enabled' in changes) {
	setupInterval(changes.enabled.newValue);
  }
});

// Initialize on extension startup or install
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(['enabled'], (result) => {
	setupInterval(result.enabled ?? false);
  });
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['enabled'], (result) => {
	setupInterval(result.enabled ?? false);
  });
});

