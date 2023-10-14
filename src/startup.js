import './window/window.js';
import {App} from './core/app.js';
import {IconManager, cconst, setIconManager, setIconMap, setTheme} from '../lib/pathux.js';
import {Icons} from '../assets/icon_enum.js';
import config from './config.js';
import {theme} from '../assets/theme.js';

Object.defineProperty(window, "C", {
  get() {
    return window._appstate.ctx;
  }
});

export function start() {
  console.log("App start!");

  require("electron").webFrame.setZoomFactor(1.0);

  /* Load icons. */
  let img = document.createElement("img");
  img.src = "../assets/iconsheet.svg"
  let iconmanager = new IconManager(
    [img, img, img, img],
    [[18, 16], [32, 16], [48, 16], [64, 16]], 16);

  setIconManager(iconmanager);
  setIconMap(Icons);
  setTheme(theme);

  cconst.loadConstants(config.pathux_config);

  window._appstate = new App();
  window._appstate.makeScreen();

  let ipc = window.ipc = require("electron").ipcRenderer;
  ipc.invoke("getXMLFile", []).then(function(xmlbuf) {
    console.log(xmlbuf);

    _appstate.ctx.window.loadXML(xmlbuf);
  });
}