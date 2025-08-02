//CONSTANTS
const ALARM_NAME = "ExtendSessionAlarm";
const MAX_INTERVAL = 1;
const MIN_INTERVAL = 1;
const TARGET_URL = "*://*.acenet.aceservices.com/*"

//FUNCTIONS
function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: "ON" });
    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" }); // green
  } else {
    chrome.action.setBadgeText({ text: "" });
  }
}

function createAlarm() {
	const delay = Math.random() * (MAX_INTERVAL - MIN_INTERVAL + 1) + MIN_INTERVAL;
	chrome.alarms.create(ALARM_NAME, {delayInMinutes: delay}, console.log('Alarm Created, delay: ' + delay));
}

function clearAlarm () {
	chrome.alarms.clear(
		ALARM_NAME,
		console.log('Cleared Alarm')
	)
}

function injectScript() {
	chrome.tabs.query({url: TARGET_URL}, (tabs) => {
		for (const tab of tabs) {
			chrome.scripting.executeScript({
				target: {tabId: tab.id},
				files: ['injector.js']
			})
		}
	});
}

//LISTENERS
chrome.alarms.onAlarm.addListener((alarm) => {
  console.log("Alarm Triggered " + alarm.name);
  injectScript();
  createAlarm();
});

chrome.storage.onChanged.addListener((changes) => {
  if ("enabled" in changes) {
    const enabled = changes.enabled.newValue;
    updateBadge(enabled);
    if (enabled) {
		createAlarm();
    } else {
		clearAlarm();
    }
  }
});

// Initialize on extension startup or install
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["enabled"], (result) => {
    const enabled = result.enabled;
	updateBadge(enabled);
	if(enabled) {
		createAlarm();
	}
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(["enabled"], (result) => {
    const enabled = result.enabled;
	updateBadge(enabled);
	if(enabled) {
		createAlarm();
	}
  });
});
