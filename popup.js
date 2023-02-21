document.addEventListener('DOMContentLoaded', function () {
  const detectButton = document.getElementById('detect-unavailable');
  detectButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { message: 'check_unavailable' });
    });
  });
});