import { ContentScript } from './content.js'

'use strict'

class BackgroundScript {
  constructor() {
    this.contentScript = new ContentScript();
    chrome.runtime.onConnect.addListener(this.onConnect.bind(this));
    chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
  }

  async onConnect(port) {
    if (port.name === 'popup') {
      port.onMessage.addListener((message) => {
        if (message.message === 'check_unavailable') {
          this.contentScript.checkForUnavailable(message.tabId);
        }
      });
    // } else if (port.name === 'content') {
    //   this.contentPort = port;
    //   this.contentPort.onMessage.addListener((message) => {
    //     if (message.action === 'playSound') {
    //       this.playSound();
    //     }
    //   });
    }
  }

  async onTabUpdated(tabId, changeInfo, tab) {
    if (tab.url && !tab.url.startsWith('chrome://') && changeInfo.status === 'complete') {
      await this.contentScript.checkForUnavailable(tabId);
    }
  }
}

new BackgroundScript();




// class BackgroundScript {
//   constructor() {
//     this.contentScript = new ContentScript();
//     chrome.runtime.onMessage.addListener(this.onMessage.bind(this)); //runtime
//     chrome.tabs.onUpdated.addListener(this.onTabUpdated.bind(this));
//   }

//   async onMessage(request, sender, sendResponse) {
//     if (request.message === 'check_unavailable') {
//       this.contentScript.checkForUnavailable(sender.tab.id);
//     }
//   }

//   async onTabUpdated(tabId, changeInfo, tab) {
//     if (tab.url && !tab.url.startsWith('chrome://') && changeInfo.status === 'complete') {
//       await this.contentScript.checkForUnavailable(tabId);
//     }
//   }
// }

// new BackgroundScript();