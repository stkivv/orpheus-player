import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getTracks: (dir) => ipcRenderer.invoke("get/tracks", dir),
  selectDirPath: () => ipcRenderer.invoke("get/dirpath"),
});
