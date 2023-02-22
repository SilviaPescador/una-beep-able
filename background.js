import { ContentScript } from './content.js'

/* 
Escucha y envía mensajes a la página de contenido y al popup. 
Establece el icono de la extensión y reproduce un sonido si la página contiene la palabra "Unavailable". 
Establece el título de la extensión y establece un badge en el icono de la extensión. 
Este archivo es el responsable de la lógica principal de la extensión.
*/

class BackgroundScript {
  constructor() {
    this.contentScript = new ContentScript();
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  }

  async onMessage(request, sender, sendResponse) {
    if (request.message === 'check_unavailable') {
      this.contentScript.checkForUnavailable(sender.tab.id);
    }
  }

  async onTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
      await this.contentScript.checkForUnavailable(tabId);
    }
  }
}

new BackgroundScript();