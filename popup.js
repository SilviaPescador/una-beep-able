
// Agrega un manejador de eventos para el botón de "Detectar Unavailable"
const detectButton = document.getElementById('detect-unavailable');
detectButton.addEventListener('click', async function () {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab) {
    const port = chrome.runtime.connect({ name: 'popup' });
    port.postMessage({ message: 'check_unavailable', tabId: tab.id });
  } else {
    console.error('No se encontró la pestaña activa');
  }
});





// Crea una función para enviar mensajes al contenido de la pestaña activa
// async function sendMessageToTab(tabId, message) {
//   return new Promise(resolve => {
//     chrome.tabs.sendMessage(tabId, { message }, resolve);
//   });
// }


// // Agrega un manejador de eventos para el botón de "Detectar Unavailable"
// const detectButton = document.getElementById('detect-unavailable');
// detectButton.addEventListener('click', async function () {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   if (tab) {
//     await sendMessageToTab(tab.id, 'check_unavailable');
//   } else {
//     console.error('No se encontró la pestaña activa');
//   }
// });



// Solicitar permisos de reproducción de audio
// await chrome.permissions.request({permissions: ['audio']}, function (granted) {
//   if (granted) {
//     console.log('Permisos de audio concedidos');
//   } else {
//     console.log('Permisos de audio no concedidos');
//     return;
//   }
// });