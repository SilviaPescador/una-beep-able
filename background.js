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
      const iconName = isUnavailable ? 'icon-alert' : 'icon';
      const iconSizes = [16, 48, 128];
      const icons = {};

      for (const size of iconSizes) {
        icons[`${iconName}-${size}`] = `/images/${iconName}-${size}.png`;
      }

      chrome.action.setIcon({ path: icons });

      if (isUnavailable) {
        const sound = new Audio(chrome.runtime.getURL('beep.mp3'));
        sound.play();
      }
    }
  }

  async checkForUnavailable(tabId) {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });

    const isUnavailable = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        return document.body.innerText.includes('Unavailable');
      },
    });

    return isUnavailable[0];
  }
}

new BackgroundScript();