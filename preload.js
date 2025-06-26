const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  reiniciarApp: () => ipcRenderer.send('reiniciar-app'),
});
