// escucha los mensajes enviados desde el popup.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'check_unavailable') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { message: 'check_unavailable' });
    });
  }
});

// se ejecuta cuando se actualiza una pestaña -- busca "Unavailable"
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      function: () => {
        const isUnavailable = document.querySelector('._669o')?.innerText.includes('Unavailable');

        if (isUnavailable) {
          const sound = new Audio(chrome.runtime.getURL('beep.mp3'));
          sound.play();
        }
      },
    });
  }
});