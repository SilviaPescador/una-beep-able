/* 
Escucha y envía mensajes a la página de contenido y al popup. 
Establece el icono de la extensión y reproduce un sonido si la página contiene la palabra "Unavailable". 
Establece el título de la extensión y establece un badge en el icono de la extensión. 
Este archivo es el responsable de la lógica principal de la extensión.
*/

class BackgroundScript {
  constructor() {
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  }

  async onMessage(request, sender, sendResponse) {
    if (request.message === 'check_unavailable') {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(activeTab.id, { message: 'check_unavailable' });
    }
  }

  async onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      const isUnavailable = await this.checkForUnavailable(tabId);
      const iconPaths = isUnavailable ? contentScript.iconPaths.unavailable : contentScript.iconPaths.available;
  
      await chrome.action.setIcon({
        path: iconPaths,
        tabId,
      });
  
      if (isUnavailable) {
        const sound = new Audio(chrome.runtime.getURL('beep.mp3'));
        sound.play();
      }
  
      await chrome.action.setBadgeText({
        text: isUnavailable ? '!' : '',
        tabId,
      });
  
      await chrome.action.setTitle({
        title: isUnavailable ? 'Unabeepable - Unavailable Detected' : 'Unabeepable',
        tabId,
      });
    }
  }

  async checkForUnavailable(tabId) {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const isUnavailable = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: () => {
        const element = document.querySelector('._699o');
        if (element && element.textContent.trim() === 'Undefined') {
          return true;
        }
        return false;
      },
    });
  
    return isUnavailable;
  }
  
}

new BackgroundScript();