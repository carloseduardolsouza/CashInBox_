const { app, BrowserWindow, dialog, screen, Menu } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let apiProcess;

// Cria a janela principal do Electron
function createWindow() {
  // Obtém as dimensões da tela principal
  const mainScreen = screen.getPrimaryDisplay();
  const { width, height } = mainScreen.workAreaSize;

  // Remove menu da aplicação
  const mainMenu = Menu.buildFromTemplate([]);
  Menu.setApplicationMenu(mainMenu);

  // Cria a janela
  mainWindow = new BrowserWindow({
    title: "CashInBox",
    fullscreen: true,
    webPreferences: {
      nodeIntegration: false, // Segurança
      contextIsolation: true, // Isolamento entre main e renderer
      preload: path.join(__dirname, "preload.js"), // Opcional, para comunicação IPC
    },
  });

  // Carrega o frontend compilado (React build)
  mainWindow.loadFile(path.join(__dirname, "../FrontEnd/build/index.html"));
}

// Configura os eventos do autoUpdater
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
    console.log("📦 Atualização baixada, pronta para instalar.");
    const options = {
      type: "question",
      buttons: ["Sim", "Não"],
      title: "Atualização disponível",
      message:
        "Uma nova versão foi baixada. Deseja reiniciar agora para instalar?",
    };

    dialog.showMessageBox(mainWindow, options).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });
}

function startApi() {
  const apiPath = path.join(__dirname, "../BackEnd/src/server.js");
  apiProcess = spawn("node", [apiPath], {
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
    console.error("Erro ao iniciar a API:", err);
  });
}


// Inicia o backend (Node.js)
function startBackend() {
  const backendProcess = spawn("node", ["BackEnd/server.js"], {
    shell: true,
    stdio: "inherit", // Redireciona logs para o console principal
  });

  backendProcess.on("error", (err) => {
    console.error("❌ Erro ao iniciar o backend:", err);
  });

  backendProcess.on("exit", (code) => {
    if (code !== 0) {
      console.log(`⚠️ Backend terminou com código ${code}`);
    }
  });
}

// Quando o app estiver pronto
app.whenReady().then(() => {
  //startBackend(); // Inicia o backend
  createWindow(); // Cria a janela
  setupAutoUpdater(); // Configura atualizações
  startApi() //inicia a api
  autoUpdater.checkForUpdatesAndNotify();

  // Verificações periódicas de update (a cada 1 hora)
  setInterval(() => {
    autoUpdater.checkForUpdates();
  }, 1000 * 60 * 60);
});

// Encerra o app quando todas as janelas forem fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// macOS: recria a janela ao clicar no ícone do dock
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
