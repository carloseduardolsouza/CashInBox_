const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let backend;

const dbPath = path.join(app.getPath('userData'), 'database.sqlite');

function getBackendPath() {
  // Corrige o caminho do backend dependendo se está empacotado ou não
  return app.isPackaged
    ? path.join(process.resourcesPath, "BackEnd", "src", "server.js")
    : path.join(__dirname, "BackEnd", "src", "server.js");
}

function getUserFilePaths() {
  const userDataPath = app.getPath("userData");

  const databasePath = path.join(userDataPath, "database.sqlite");
  const uploadsPath = path.join(userDataPath, "uploads");

  // Garante que a pasta de uploads existe
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  return { databasePath, uploadsPath };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const frontEndPath = app.isPackaged
    ? path.join(__dirname, "FrontEnd", "build", "index.html")
    : path.join(__dirname, "FrontEnd", "build", "index.html");

  mainWindow.loadFile(frontEndPath);

  mainWindow.on("closed", () => {
    if (backend) {
      backend.kill();
      backend = null;
    }
    mainWindow = null;
    app.quit();
  });
}

app.whenReady().then(() => {
  const { databasePath, uploadsPath } = getUserFilePaths();

  const backendArgs = [getBackendPath(), databasePath, uploadsPath];
  backend = spawn("node", backendArgs, {
    stdio: "inherit",
  });

  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on("update-available", () => {
    console.log("🚀 Atualização disponível!");
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("✅ Atualização baixada. Será aplicada ao reiniciar.");
  });

  autoUpdater.on("error", (err) => {
    console.error("⚠️ Erro ao buscar atualização:", err);
  });

  backend.on("close", (code) => {
    console.log(`Backend encerrado com código ${code}`);
    if (mainWindow) mainWindow.close();
  });

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
