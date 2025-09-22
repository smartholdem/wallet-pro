const { autoUpdater } = require("electron-updater");
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

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
  autoUpdater.checkForUpdatesAndNotify();

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
