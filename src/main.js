const { app, BrowserWindow, ipcMain, ipcRenderer, dialog } = require("electron");
const path = require("node:path");
const fs = require("fs").promises;
const config = require("dotenv");
config.config();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "logo/logo.ico"),
    title: "Orpheus Player",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.removeMenu();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("get/tracks", async (event, dir) => {
  if (dir == undefined) return [];
  try {
    const fileNames = await fs.readdir(dir);
    const result = await Promise.all(
      fileNames.map(async (file) => {
        const filePath = path.join(dir, file);
        const data = await fs.readFile(filePath);
        return { name: file, data };
      })
    );
    return result;
  } catch (error) {
    console.log("error: " + error.message);
    return [];
  }
});

ipcMain.handle("get/dirpath", async (event, args) => {
  const paths = await dialog.showOpenDialog({ properties: ["openDirectory"] });
  return paths.filePaths[0] ?? undefined;
});
