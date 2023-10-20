
const debug = 1;

function print_help() {
  console.log("\nexpected file path\n");
}

if (process.argv.length < 3) {
  print_help();
  process.exit();
}

const fs = require('fs');

let filepath = process.argv[2];
let xmlbuf = fs.readFileSync(filepath, "utf8");
const pathmod = require("path");

const {app, BrowserWindow, dialog} = require('electron')
const {ipcMain, Menu, MenuItem, nativeTheme} = require('electron')

function makeInvoker(event, callbackKey, getargs = (args) => {
  args
}) {
  return function () {
    let args = getargs(arguments);
    console.log("ARGS", args);

    win.webContents.send('invoke-menu-callback', callbackKey, args);
  }
}

function loadMenu(event, menudef) {
  //console.log("MENU", menudef);

  let menu = new Menu();

  for (let item of menudef) {
    if (item.submenu) {
      item.submenu = loadMenu(event, item.submenu);
    }

    if (item.click) {
      item.click = makeInvoker(event, item.click, (args) => [args[0].id]);
    }

    item = new MenuItem(item);

    menu.append(item);
  }

  return menu;
}

let menus = {};
let menuBarId = undefined;

ipcMain.handle("getXMLFile", function(e) {
  return xmlbuf;
});

ipcMain.handle("getXMLPath", function(e) {
  return pathmod.normalize(pathmod.resolve(filepath));
});

ipcMain.handle("nativeTheme.setThemeSource", async (event, val) => {
  nativeTheme.themeSource = val;
});

ipcMain.handle("nativeTheme", async (event) => {
  let obj = {};

  for (let k in nativeTheme) {
    let v = nativeTheme[k];

    if (typeof v !== "object" && typeof v !== "function") {
      obj[k] = v;
    }
  }

  if (win) {
    win.webContents.send('nativeTheme', obj);
  }
});

// Main
ipcMain.handle('popup-menu', async (event, menu, x, y, callback) => {
  let id = menu._ipcId;

  callback = makeInvoker(event, callback);
  menu = loadMenu(event, menu);

  menus[id] = menu;
  menu.popup({x, y, callback});
});

ipcMain.handle('close-menu', async (event, menuid) => {
  menus[menuid].closePopup(win);
});

ipcMain.handle('set-menu-bar', async (event, menu) => {
  let id = menu._ipcId;

  menu = loadMenu(event, menu);

  if (menuBarId !== undefined) {
    delete menus[menuBarId];
  }

  menus[id] = menu;
  menuBarId = id;

  Menu.setApplicationMenu(menu);
});

ipcMain.handle('show-open-dialog', async (event, args, then, catchf) => {
  let dialog = require('electron').dialog;

  dialog.showOpenDialog(args).then(makeInvoker(event, then, (args) => {
    let e = {
      filePaths: args[0].filePaths,
      cancelled: args[0].cancelled,
      canceled : args[0].canceled
    };

    return [e];
  })).catch(makeInvoker(event, catchf));
});

ipcMain.handle('show-save-dialog', async (event, args, then, catchf) => {
  let dialog = require('electron').dialog;

  dialog.showSaveDialog(args).then(makeInvoker(event, then, (args) => {
    let e = {
      filePath : args[0].filePath,
      cancelled: args[0].cancelled,
      canceled : args[0].canceled
    };

    return [e];
  })).catch(makeInvoker(event, catchf));
});

const createWindow = () => {
  const preloadPath = pathmod.join(__dirname, "preload.cjs");
  console.error(preloadPath);

  let w, h;
  if (debug) {
    w = 1400;
    h = 900;
  } else {
    w = 1000;
    h = 900;
  }

  globalThis.win = new BrowserWindow({
    width          : w,
    height         : h,
    nodeIntegration: true,
    webPreferences : {
      nodeIntegration        : true,
      nodeIntegrationInWorker: true,
      /* Needed for node integration. */
      contextIsolation           : false,
      sandbox                    : false,
      enableRemoteModule         : true,
      experimentalFeatures       : true,
      allowRunningInsecureContent: true,
      preload                    : preloadPath,
    }
  });

  win.loadFile('electron/window.html')
  if (debug) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  app.quit()
})
