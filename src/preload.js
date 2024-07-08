import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("api", {
  getSongs: () => ipcRenderer.invoke("get/songs"),
});
