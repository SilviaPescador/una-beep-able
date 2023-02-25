/* global chrome */

'use strict'

export class ContentScript {
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
  // usa isUnavailable para verificar si "Unavailable" está, y si es true, emite pitido, actualiza icono, título y texto de la extension como notificación.
  async checkForUnavailable(tabId) {
    const isUnavailable = await this.isUnavailable(tabId);


    if (isUnavailable) {

      chrome.tabs.create({ url: chrome.runtime.getURL('sounds/beep.ogg') });

      if (chrome.tts) {
        chrome.tts.speak('Hey, wake up!');
      }

      const iconPath = this.iconPaths.unavailable;

      await Promise.all([
        chrome.action.setIcon({
          path: iconPath,
          tabId,
        }),
        chrome.action.setBadgeText({ // ok
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
  // verifica si  "Unavailable" está en la pestaña especificada. true/false
  async isUnavailable(tabId) {
    const tab = await chrome.tabs.get(tabId);
    if (tab.id !== tabId) return false;
    console.log('tab.id:', tab.id)
    console.log('tatId: ',tabId)
    // chrome.scripting.executeScript devuelve un array de objetos. Destructuramos buscando solo 1 de esos objetos [result]
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const element = document.querySelector('._21nHd');
        console.log('element: ', element)
        return element?.textContent?.trim() === 'Unavailable';
      },
    });
    console.log(result.result)
    // del objeto [result] sacamos su propiedad booleana
    return result.result;
  }
}

const contentScript = new ContentScript();

// espero el mensaje "check_unavailable" y llama al método checkForUnavailable de la clase ContentScript
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.message === 'check_unavailable') {
    await contentScript.checkForUnavailable(sender.tab.id);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (tab.url && !tab.url.startsWith('chrome://') && changeInfo.status === 'complete') {
    await contentScript.checkForUnavailable(tabId);
  }
});

