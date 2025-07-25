const button = document.getElementById('toggleButton');

chrome.storage.local.get(['enabled'], (result) => {
  const isEnabled = result.enabled ?? false;
  button.textContent = isEnabled ? 'Turn OFF' : 'Turn ON';
});

button.addEventListener('click', () => {
  chrome.storage.local.get(['enabled'], (result) => {
	const newState = !(result.enabled ?? false);
	chrome.storage.local.set({ enabled: newState }, () => {
	  button.textContent = newState ? 'Turn OFF' : 'Turn ON';
	});
  });
});
