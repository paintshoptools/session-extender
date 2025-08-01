(async () => {
  const url = chrome.runtime.getURL("injected.js");  // ✅ resolved correctly here
  const script = document.createElement("script");
  script.src = url;
  script.type = "text/javascript";
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
})();

