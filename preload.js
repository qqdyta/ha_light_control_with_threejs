const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('ipcRenderer', {
  invoke: (channel, args) => ipcRenderer.invoke(channel, args),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
  once: (channel, callback) => ipcRenderer.once(channel, (event, ...args) => callback(...args)),
  send: (channel, data) => ipcRenderer.send(channel, data),
});