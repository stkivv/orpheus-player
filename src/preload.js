import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getSongs: (dir) => ipcRenderer.invoke("get/songs", dir),
  selectDirPath: () => ipcRenderer.invoke("get/dirpath"),
});
