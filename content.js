function checkForUnavailable(tabId, changeInfo, tab) {
  // Obtiene el ID de la pestaña activa actual
  const activeTabId = tab.id;

  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: activeTabId },
      function: () => {
        const isUnavailable = document.body.innerText.includes('Unavailable');

        if (isUnavailable) {
          const sound = new Audio(chrome.runtime.getURL('beep.mp3'));
          sound.play();

          chrome.action.setIcon({
            path: 'icon-alert.png',
            tabId: activeTabId,
          });

          chrome.action.setBadgeText({
            text: '!',
            tabId: activeTabId,
          });

          chrome.action.setTitle({
            title: 'Unabeepable - Unavailable Detected',
            tabId: activeTabId,
          });

          chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Unabeepable - Unavailable Detected',
            message: 'The word "Unavailable" was detected in the page content.',
          });
        }
      },
    });
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'check_unavailable') {
    checkForUnavailable(sender.tab.id);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  checkForUnavailable(tabId, changeInfo, tab);
});