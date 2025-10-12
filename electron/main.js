const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// Single instance lock
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

const isDev = !app.isPackaged;
let mainWindow;

function createWindow() {
  const iconPath = path.join(__dirname, "..", "build", "icon.ico");
  const hasIcon = isDev && fs.existsSync(iconPath);

  const browserOptions = {
    width: 1280,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#2f3241',
      symbolColor: '#74b1be'
    },
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      devTools: true,
    },
  };

  if (hasIcon) browserOptions.icon = iconPath;

  mainWindow = new BrowserWindow(browserOptions);

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const safeProtocols = ["http:", "https:"];
      const u = new URL(url);
      if (!safeProtocols.includes(u.protocol)) return { action: "deny" };
      shell.openExternal(url);
    } catch (_) {
      /* ignore */
    }
    return { action: "deny" };
  });

  // Wait for the content to finish loading before checking for updates
  mainWindow.webContents.on('did-finish-load', () => {
    if (!isDev) { // Only check when packaged
      const currentVersion = app.getVersion();
      axios.get('https://api.github.com/repos/smartholdem/wallet-pro/releases/latest')
        .then(response => {
          const latestVersionString = response.data.tag_name.replace('v', '');
          const currentVersionNum = parseInt(currentVersion.replace(/\./g, ''), 10);
          const latestVersionNum = parseInt(latestVersionString.replace(/\./g, ''), 10);

          if (latestVersionNum > currentVersionNum) {
            mainWindow.webContents.send('update-available', response.data.tag_name);
          }
        })
        .catch(error => {
          console.error('Failed to check for updates:', error);
        });
    }
  });

  // Load Vite dev server or production build
  if (isDev) {
    const devUrl = process.env.ELECTRON_RENDERER_URL || "http://127.0.0.1:5173";
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.on("did-fail-load", () => {
      // Retry once after short delay in dev, in case Vite isn't ready yet
      setTimeout(() => mainWindow.loadURL(devUrl), 500);
    });
  } else {
    const indexPath = path.join(__dirname, "..", "dist", "index.html");
    mainWindow.loadFile(indexPath);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

ipcMain.on("minimize-window", () => {
  mainWindow.minimize();
});

ipcMain.on("maximize-window", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});

ipcMain.on("close-window", () => {
  mainWindow.close();
});

app.setAppUserModelId("com.smartholdem.walletpro");

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});