const { contextBridge, ipcRenderer } = require("electron");

// Expose a minimal, safe API to the renderer if needed
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("minimize-window"),
  maximize: () => ipcRenderer.send("maximize-window"),
  close: () => ipcRenderer.send("close-window"),

  send: (channel, data) => {
    // allowlist channels here if you add any
    ipcRenderer.send(channel, data);
  },
  on: (channel, listener) => {
    const subscription = (_event, ...args) => listener(...args);
    ipcRenderer.on(channel, subscription);
    return () => ipcRenderer.removeListener(channel, subscription);
  },
});
