const { app, BrowserWindow, dialog, screen, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let apiProcess;

// Cria a janela principal do Electron
function createWindow() {
  // Remove o menu da aplicação
  const mainMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(mainMenu);

  mainWindow = new BrowserWindow({
    title: "CashInBox",
    frame: false,
    resizable: false,
    movable: false,
    minimizable: true,
    fullscreenable: false,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Carrega o React compilado
  const indexPath = path.join(__dirname, "../FrontEnd/build/index.html");
  mainWindow.loadFile(indexPath).catch((err) => {
    console.error("❌ Erro ao carregar o frontend:", err);
  });
}

// Inicia a API local
function startApi() {
  const apiPath = path.join(__dirname, "../BackEnd/src/server.js");

  apiProcess = spawn(process.execPath, [apiPath], {
    cwd: path.join(__dirname, "../BackEnd"),
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  apiProcess.stdout.on("data", (data) => {
    console.log(`[API]: ${data.toString()}`);
  });

  apiProcess.stderr.on("data", (data) => {
    console.error(`[API ERROR]: ${data.toString()}`);
  });

  apiProcess.on("close", (code) => {
    console.log(`[API] encerrada com código ${code}`);
  });

  apiProcess.on("error", (err) => {
    console.error("❌ Erro ao iniciar a API:", err);
  });
}

// Configura o sistema de atualizações automáticas
function setupAutoUpdater() {
  autoUpdater.on("checking-for-update", () => {
    console.log("🔄 Verificando por atualizações...");
  });

  autoUpdater.on("update-available", () => {
    console.log("⬇️ Atualização disponível!");
  });

  autoUpdater.on("update-not-available", () => {
    console.log("✅ Nenhuma atualização disponível.");
  });

  autoUpdater.on("error", (err) => {
    console.error("❌ Erro ao verificar atualização:", err);
  });

  autoUpdater.on("update-downloaded", () => {
    console.log("📦 Atualização baixada.");
    const options = {
      type: "question",
      buttons: ["Sim", "Não"],
      title: "Atualização disponível",
      message: "Uma nova versão foi baixada. Deseja reiniciar agora para instalar?",
    };

    dialog.showMessageBox(mainWindow, options).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

// Quando o app estiver pronto
app.whenReady().then(() => {
  startApi(); // Inicia a API primeiro
  createWindow(); // Cria a janela do app
  setupAutoUpdater(); // Configura atualizações
  autoUpdater.checkForUpdatesAndNotify();

  // Verifica atualizações a cada 1 hora
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 60);
});

// Fecha o app se todas as janelas forem fechadas
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (apiProcess) apiProcess.kill();
    app.quit();
  }
});

// macOS: recria janela se o usuário clicar no ícone do dock
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
