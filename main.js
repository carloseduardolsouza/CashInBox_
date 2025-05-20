const { app, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

let mainWindow;
let backend;

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
  mainWindow = new BrowserWindow({
    show: false, // só mostra depois de carregar
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const frontEndPath = app.isPackaged
    ? path.join(__dirname, "FrontEnd", "build", "index.html")
    : path.join(__dirname, "FrontEnd", "build", "index.html");

  mainWindow.loadFile(frontEndPath);

  // Maximiza quando estiver pronto e então mostra
  mainWindow.once("ready-to-show", () => {
    mainWindow.maximize(); // ocupa toda a tela, sem sobrepor taskbar
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
    stdio: "ignore",       // não abre o terminal
    windowsHide: true,     // esconde CMD no Windows
  });

  backend.unref(); // solta o processo
}

function setupAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify();

  // Verifica atualização de 1 em 1 hora
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
