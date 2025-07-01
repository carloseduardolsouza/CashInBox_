const { app, BrowserWindow, screen, ipcMain, dialog } = require("electron");
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
      sandbox: false,
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
    stdio: app.isPackaged ? "ignore" : "inherit",
    windowsHide: true,
  });

  backend.unref();

  console.log("🚀 Backend iniciado:", backendScript);
}

// Eventos da Janela
ipcMain.on("window:minimize", () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on("window:close", () => {
  if (mainWindow) mainWindow.close();
});

// Evento para reiniciar manualmente (caso queira usar no botão também)
ipcMain.on("reiniciar-app", () => {
  app.relaunch();
  app.exit();
});

// === AUTO-UPDATER ===
function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.checkForUpdatesAndNotify();

  // Checagem periódica a cada 1 hora
  setInterval(() => {
    console.log("🔄 Verificando atualizações...");
    autoUpdater.checkForUpdatesAndNotify();
  }, 60 * 60 * 1000);

  autoUpdater.on("update-available", () => {
    console.log("🚀 Atualização disponível! Baixando...");
    if (mainWindow) {
      mainWindow.webContents.send("update_available");
    }
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("✅ Atualização baixada.");
    if (mainWindow) {
      mainWindow.webContents.send("update_downloaded");

      // Caixa de diálogo (opcional — você pode tirar se quiser só o botão)
      const options = {
        type: "question",
        buttons: ["Sim", "Agora não"],
        defaultId: 1,
        title: "Atualização disponível",
        message: "Uma nova versão foi baixada.",
        detail: "Deseja reiniciar agora para aplicar a atualização?",
      };

      dialog.showMessageBox(mainWindow, options).then((response) => {
        if (response.response === 0) {
          console.log("🔁 Reiniciando para atualizar...");
          autoUpdater.quitAndInstall();
        } else {
          console.log("🕒 Usuário escolheu atualizar depois.");
        }
      });
    }
  });

  autoUpdater.on("error", (err) => {
    console.error("⚠️ Erro ao buscar atualização:", err);
  });
}

// Evento do botão "Atualizar agora" vindo do frontend
ipcMain.on("instalar-atualizacao", () => {
  console.log("🖱️ Usuário clicou para instalar atualização.");
  autoUpdater.quitAndInstall();
});

// App lifecycle
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
  if (process.platform !== "darwin") {
    if (backend) {
      backend.kill();
      backend = null;
    }
    app.quit();
  }
});
