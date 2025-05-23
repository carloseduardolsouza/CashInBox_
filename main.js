const { app, BrowserWindow, screen, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let backend;

const preloadPath = path.join(__dirname, "preload.js");

function getBackendPath() {
  return app.isPackaged
    ? path.join(process.resourcesPath, "BackEnd", "src", "server.js")
    : path.join(__dirname, "BackEnd", "src", "server.js");
}

function getUserFilePaths() {
  const userDataPath = app.getPath("userData");
  const databasePath = path.join(userDataPath, "database.sqlite");
  const uploadsPath = path.join(userDataPath, "uploads");

  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
  } catch (err) {
    console.error("❌ Erro criando pasta uploads:", err);
  }

  return { databasePath, uploadsPath };
}

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();

  mainWindow = new BrowserWindow({
    x: workArea.x,
    y: workArea.y,
    width: workArea.width,
    height: workArea.height,
    frame: false,
    resizable: false,
    movable: false,
    maximizable: false,
    minimizable: true,
    fullscreenable: false,
    skipTaskbar: false,
    alwaysOnTop: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // ⚠️ atenção aos riscos!
      preload: preloadPath,
    },
  });

  mainWindow.setMenu(null);

  const frontEndPath = path.join(__dirname, "FrontEnd", "build", "index.html");

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
  const backendScript = getBackendPath();

  const backendArgs = [backendScript, databasePath, uploadsPath];

  backend = spawn("node", backendArgs, {
    detached: false,
    stdio: app.isPackaged ? "ignore" : "inherit", // Silencie só em prod
    windowsHide: true,
  });

  backend.unref();

  console.log("🚀 Backend iniciado:", backendScript);
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
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  // No macOS, apps continuam abertos até CMD+Q
  if (process.platform !== "darwin") {
    if (backend) {
      backend.kill();
      backend = null;
    }
    app.quit();
  }
});
