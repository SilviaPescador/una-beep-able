/*
Verifica si la página actual contiene la palabra "Unavailable" 
Notifica a background.js para que este actualice el icono y reproduzca el sonido correspondiente. 
Establece un badge en el icono de la extensión y establece el título de la extensión. 
Este archivo se comunica con background.js a través de los mensajes.
*/

class ContentScript {
  constructor() {
    this.iconPaths = {
      available: {
        16: 'images/icon-16.png',
        48: 'images/icon-48.png',
        128: 'images/icon-128.png',
      },
      unavailable: {
        16: 'images/icon-alert-16.png',
        48: 'images/icon-alert-48.png',
        128: 'images/icon-alert-128.png',
      },
    };
  }

  async checkForUnavailable(tabId) {
    const isUnavailable = await this.isUnavailable(tabId);

    if (isUnavailable) {
      const sound = new Audio(chrome.runtime.getURL('beep.mp3'));
      sound.play();

      const iconPath = this.iconPaths.unavailable;

      await Promise.all([
        chrome.action.setIcon({
          path: iconPath,
          tabId,
        }),
        chrome.action.setBadgeText({
          text: '!',
          tabId,
        }),
        chrome.action.setTitle({
          title: 'Unabeepable - Unavailable Detected',
          tabId,
        }),
        chrome.notifications.create({
          type: 'basic',
          iconUrl: iconPath[48],
          title: 'Unabeepable - Unavailable Detected',
          message: 'The word "Unavailable" was detected in the page content.',
        }),
      ]);
    } else {
      const iconPath = this.iconPaths.available;

      await Promise.all([
        chrome.action.setIcon({
          path: iconPath,
          tabId,
        }),
        chrome.action.setBadgeText({
          text: '',
          tabId,
        }),
        chrome.action.setTitle({
          title: 'Unabeepable',
          tabId,
        }),
      ]);
    }
  }

  async isUnavailable(tabId) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab.id !== tabId) return false;

    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => document.body.innerText.includes('Unavailable'),
    });

    return result;
  }
}

const contentScript = new ContentScript();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'check_unavailable') {
    await contentScript.checkForUnavailable(sender.tab.id);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    await contentScript.checkForUnavailable(tabId);
  }
});