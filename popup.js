/*
 Actualiza el icono de la extensión  
 Muestra una notificación si la página actual contiene la palabra "Unavailable". 
 Este archivo se comunica con background.js a través de los mensajes.
 */

// Crea una función para enviar mensajes al contenido de la pestaña activa
async function sendMessageToActiveTab(message) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, { message }, resolve);
  });
}

// Agrega un manejador de eventos para el botón de "Detectar no disponible"
const detectButton = document.getElementById('detect-unavailable');
detectButton.addEventListener('click', async function () {
  await sendMessageToActiveTab('check_unavailable');
});