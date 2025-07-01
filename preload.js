const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Reinicia o app manualmente (você já tinha isso)
  reiniciarApp: () => ipcRenderer.send('reiniciar-app'),

  // Evento: atualização disponível
  onUpdateAvailable: (callback) => ipcRenderer.on('update_available', callback),

  // Evento: atualização foi baixada e está pronta para instalar
  onUpdateDownloaded: (callback) => ipcRenderer.on('update_downloaded', callback),

  // Botão do frontend pedindo pra instalar agora
  instalarAtualizacao: () => ipcRenderer.send('instalar-atualizacao'),
});
