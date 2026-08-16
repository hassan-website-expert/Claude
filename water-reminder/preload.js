// Safe bridge between the renderer (the web UI) and the Electron main process.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("sip", {
  // Renderer -> main
  alarmFired: () => ipcRenderer.send("alarm-fired"),
  sipVerified: () => ipcRenderer.send("sip-verified"),
  // Main -> renderer (tray menu commands: "start" | "stop" | "test")
  onCommand: (cb) => ipcRenderer.on("cmd", (_e, command) => cb(command)),
  isDesktop: true
});
