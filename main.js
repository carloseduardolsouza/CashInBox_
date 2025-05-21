const { app, BrowserWindow, screen } = require("electron");
const { autoUpdater } = require("electron-updater");
const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let backend;

const preloadPath = app.isPackaged
  ? path.join(process.resourcesPath, "preload.js")
  : path.join(__dirname, "preload.js");

function getBackendPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "BackEnd", "src", "server.js")
    : path.join(__dirname, "BackEnd", "src", "server.js");
}

function getUserFilePaths() {
  const userDataPath = app.getPath("userData");
  const databasePath = path.join(userDataPath, "database.sqlite");
  const uploadsPath = path.join(userDataPath, "uploads");

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  return { databasePath, uploadsPath };
}

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay(); // pega só a área útil (sem taskbar)

  mainWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    frame: false,            // remove moldura e barra padrão
    resizable: false,        // não permite redimensionar
    movable: false,          // não permite mover a janela
    maximizable: false,
    minimizable: true,      // se quiser, pode ativar depois
    fullscreenable: false,
    skipTaskbar: false,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: preloadPath,
    },
  });

  mainWindow.setMenu(null); // remove a barra de menu (alt etc.)

  const frontEndPath = app.isPackaged
    ? path.join(__dirname, "FrontEnd", "build", "index.html")
    : path.join(__dirname, "FrontEnd", "build", "index.html");

  mainWindow.loadFile(frontEndPath);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    if (backend) {
      backend.kill();
      backend = null;
    }
    mainWindow = null;
    app.quit();
  });
}

function startBackend() {
  const { databasePath, uploadsPath } = getUserFilePaths();
  const backendArgs = [getBackendPath(), databasePath, uploadsPath];

  backend = spawn("node", backendArgs, {
    detached: true,
    stdio: "ignore",
    windowsHide: true,
  });

  backend.unref();
}

ipcMain.on("window:minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window:close", () => {
  if (mainWindow) mainWindow.close();
});

function setupAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify();

  setInterval(() => {
    console.log("🔄 Verificando atualizações...");
    autoUpdater.checkForUpdatesAndNotify();
  }, 60 * 60 * 1000);

  autoUpdater.on("update-available", () => {
    console.log("🚀 Atualização disponível!");
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("✅ Atualização baixada. Será aplicada ao reiniciar.");
  });

  autoUpdater.on("error", (err) => {
    console.error("⚠️ Erro ao buscar atualização:", err);
  });
}

app.whenReady().then(() => {
  startBackend();
  createWindow();
  setupAutoUpdater();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backend) {
    backend.kill();
    backend = null;
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});
