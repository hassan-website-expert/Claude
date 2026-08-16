// Sip — Electron main process
// Creates the window, a menu-bar/tray icon, native reminders, and launch-at-login.
const { app, BrowserWindow, Tray, Menu, nativeImage, Notification, ipcMain, session } = require("electron");
const path = require("path");

let win = null;
let tray = null;
app.isQuitting = false;

// Single instance — focus the existing window instead of opening a second one.
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on("second-instance", () => { if (win) { win.show(); win.focus(); } });
}

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 820,
    minWidth: 430,
    minHeight: 640,
    title: "Sip",
    icon: path.join(__dirname, "assets/icon.png"),
    backgroundColor: "#0b1220",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false // keep the countdown accurate while hidden
    }
  });

  win.loadFile(path.join(__dirname, "renderer/index.html"));

  win.webContents.on("did-fail-load", (_e, code, desc) =>
    console.error("Renderer failed to load:", code, desc));
  win.webContents.on("did-finish-load", () => {
    console.log("Sip renderer loaded.");
    if (process.env.SIP_SELFTEST === "1") { app.isQuitting = true; setTimeout(() => app.quit(), 400); }
  });

  // Closing the window hides it to the tray instead of quitting,
  // so reminders keep running in the background.
  win.on("close", (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      win.hide();
      if (process.platform === "darwin") app.dock?.hide();
    }
  });
}

function trayIcon() {
  // Use the template image on macOS so it adapts to light/dark menu bars.
  const file = process.platform === "darwin" ? "assets/trayTemplate.png" : "assets/tray.png";
  const img = nativeImage.createFromPath(path.join(__dirname, file));
  if (process.platform === "darwin") img.setTemplateImage(true);
  return img.isEmpty() ? nativeImage.createEmpty() : img;
}

function showWindow() {
  if (!win) createWindow();
  win.show();
  win.focus();
  if (process.platform === "darwin") app.dock?.show();
}

function buildTray() {
  tray = new Tray(trayIcon());
  const menu = Menu.buildFromTemplate([
    { label: "Open Sip", click: showWindow },
    { label: "Start reminders", click: () => win?.webContents.send("cmd", "start") },
    { label: "Stop reminders", click: () => win?.webContents.send("cmd", "stop") },
    { label: "Remind me now", click: () => { showWindow(); win?.webContents.send("cmd", "test"); } },
    { type: "separator" },
    {
      label: "Launch at login",
      type: "checkbox",
      checked: app.getLoginItemSettings().openAtLogin,
      click: (item) => app.setLoginItemSettings({ openAtLogin: item.checked, openAsHidden: true })
    },
    { type: "separator" },
    { label: "Quit Sip", click: () => { app.isQuitting = true; app.quit(); } }
  ]);
  tray.setToolTip("Sip — time to drink water");
  tray.setContextMenu(menu);
  tray.on("click", () => (win && win.isVisible() ? win.hide() : showWindow()));
}

app.whenReady().then(() => {
  // Allow the renderer to use the camera (and notifications) without extra prompts.
  session.defaultSession.setPermissionRequestHandler((_wc, permission, cb) => {
    cb(permission === "media" || permission === "notifications");
  });
  session.defaultSession.setPermissionCheckHandler((_wc, permission) =>
    permission === "media" || permission === "notifications"
  );

  createWindow();
  try {
    buildTray();
  } catch (err) {
    // Some minimal Linux setups have no system-tray backend; the app still works from its window.
    console.warn("Tray unavailable:", err?.message || err);
  }

  // Turn on launch-at-login by default the first run; users can toggle it in the tray.
  if (!app.getLoginItemSettings().wasOpenedAtLogin) {
    app.setLoginItemSettings({ openAtLogin: true, openAsHidden: true });
  }
});

// Keep running in the tray after the window is closed (except on quit).
app.on("window-all-closed", (e) => { /* stay alive in tray */ });
app.on("before-quit", () => { app.isQuitting = true; });
app.on("activate", () => showWindow());

// Renderer tells us an alarm fired -> surface the window + a native notification.
ipcMain.on("alarm-fired", () => {
  showWindow();
  if (Notification.isSupported()) {
    const n = new Notification({
      title: "💧 Time to drink water",
      body: "Open Sip and take a sip — the camera will verify it.",
      silent: false
    });
    n.on("click", showWindow);
    n.show();
  }
});

// Renderer tells us a sip was verified -> optional confirmation ping.
ipcMain.on("sip-verified", () => {
  if (Notification.isSupported()) {
    new Notification({ title: "Nice 💧", body: "Sip verified. Staying hydrated!", silent: true }).show();
  }
});
