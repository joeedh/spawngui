import {Sheet} from '../windows/sheet/sheet.js';
import {DataAPI, ToolStack} from '../../lib/pathux.js';
import {AppContext} from './context.js';
import {MainMenu} from '../windows/mainmenu/menu.js';
import {Console} from '../windows/console/console.js';
import '../windows/screen.js';
import {WindowBuilder} from './parsexml.js';
import {loadAppFile, saveAppFile} from './file.js';

const LOCALSTORAGE_SCREEN_KEY = "_screen_config";

export class App {
  screen = undefined;
  toolstack = undefined;
  ctx = new AppContext();
  api = new DataAPI();
  builder = undefined;
  xmlPath = "";

  constructor(xmlPath) {
    this.xmlPath = xmlPath;

    this.toolstack = new ToolStack(this.ctx);
    this.builder = new WindowBuilder(this.ctx)
    this.api = this.builder.api;
  }

  #getSavePropKey(xmlPath = this.xmlPath) {
    return "_saved_path_" + xmlPath.toLowerCase().trim();
  }

  getSavedProps(xmlPath = this.xmlPath) {
    let key = this.#getSavePropKey(xmlPath);

    if (key in localStorage) {
      console.log("Found cached props");

      let data = JSON.parse(localStorage[key]);
      let file = loadAppFile(this, data, {JSON: true, loadScreen: false, loadProps: true});

      /* Just set the properties, they'll be loaded and checked in Sheet.parseXML.*/
      if (Reflect.ownKeys(this.builder.props).length === 0) {
        for (let prop of file.props) {
          this.builder.props[prop.apiname] = prop.getValue();
        }
      } else {
        let props = this.builder.props;

        for (let prop of file.props) {
          if (!(prop.apiname in props)) {
            console.error("Orphaned property " + prop.apiname);
            continue;
          }

          props[prop.apiname] = prop.getValue();
        }
      }
    }
  }

  saveFile(opt = undefined) {
    return saveAppFile(this, opt);
  }

  loadFile(data, opt = undefined) {
    return loadAppFile(this, data, opt);
  }

  saveStartupFile() {
    let data = JSON.stringify(this.saveFile({JSON: true}));

    console.log("Saved started file %dkb", (data.length/1024).toFixed(2));
    localStorage[LOCALSTORAGE_SCREEN_KEY] = data;

    if (this.builder && this.builder.container && this.builder.props && Reflect.ownKeys(this.builder.props).length > 0) {
      let key = this.#getSavePropKey();
      localStorage[key] = data;
    }
  }

  loadStartupFile() {
    if (LOCALSTORAGE_SCREEN_KEY in localStorage) {
      const json = JSON.parse(localStorage[LOCALSTORAGE_SCREEN_KEY]);

      this.loadFile(json, {
        JSON      : true,
        loadProps : false,
        loadScreen: true
      });
    } else {
      this.reset();
    }

    try {
      this.getSavedProps();
    } catch (error) {
      console.error(error.stack);
      console.error(error.message);
    }
  }

  reset() {
    if (this.screen) {
      try {
        this.screen.unlisten();
        this.screen.remove();
      } catch (error) {
        console.error(error.stack);
        console.error(error.message);
      }
    }

    this.screen = undefined;
    this.toolstack = new ToolStack(this.ctx);
    this.builder = new WindowBuilder(this.ctx)
    this.api = this.builder.api;

    this.makeScreen();

    return this;
  }

  makeScreen() {
    let screen = document.createElement("app-screen-x");
    let sarea = document.createElement("screenarea-x");

    screen.ctx = this.ctx;
    sarea.ctx = this.ctx;

    screen.appendChild(sarea);
    sarea.switchEditor(Sheet);

    let sarea2 = screen.splitArea(sarea, 0.1, true);
    sarea.switchEditor(MainMenu);

    if (0) {
      let sarea3 = screen.splitArea(sarea2, 0.6);
      sarea3.switchEditor(Console);
    }

    if (this.screen) {
      this.screen.unlisten();
      this.screen.remove();
    }

    document.body.style["margin"] = document.body.style["padding"] = "0px";
    document.body.appendChild(screen);

    this.screen = screen;
    this.screen.listen();
    this.screen.completeUpdate();

    if (Reflect.ownKeys(this.builder.props).length > 0) {
      try {
        this.screen.loadBuilder(this.builder);
      } catch (error) {
        console.error(error.stack);
        console.error(error.message);
      }
    }
  }
}

