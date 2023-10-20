import {
  ScreenArea, platform, electron_api, Area,
  Screen, UIBase, AreaFlags, nstructjs
} from '../../../lib/pathux.js';
import {AppArea} from '../area_base.js';

export class MainMenu extends AppArea {
  #height = 32;
  #electronInit = false;

  static STRUCT = nstructjs.inherit(MainMenu, AppArea) + `
}`;

  static define() {
    return {
      areaname: "menu",
      uiname  : "Menu",
      tagname : "app-menu-x",
      icon    : -1,
      flag    : AreaFlags.HIDDEN | AreaFlags.NO_SWITCHER,
    }
  }

  constructor() {
    super();

    this.borderLock = 1 | 2 | 4 | 8;
    this.areaDragToolEnabled = false;

    this.updateHeight();

    this.header = document.createElement("rowframe-x");
    this.shadow.appendChild(this.header);
  }

  getScreen() {
    return this.ctx.screen;
  }

  updateHeight() {
    if (!this.header)
      return;

    if (window.haveElectron) {
      this.maxSize[1] = this.minSize[1] = 1;

      if (!this.#electronInit) {
        console.log("platform", electron_api);
        this.#electronInit = true;
        electron_api.initMenuBar(this);

        this.getScreen().solveAreaConstraints();
      }

      return;
    }

    let rect = this.header.getClientRects()[0];
    if (rect) {
      this.#height = rect.height;
    }

    let update = this.#height !== this.minSize[1];
    this.minSize[1] = this.maxSize[1] = this.#height;

    if (update && this.ctx && this.getScreen()) {
      this.getScreen().solveAreaConstraints();
    }
  }

  init() {
    super.init();

    this.header.menu("File", []);
    this.header.menu("View", [
      ["Console", () => {
        this.getScreen().toggleConsole();
      }]
    ]);

    this.header.menu("Edit", [
      ["Undo", () => _appstate.toolstack.undo()],
      ["Redo", () => _appstate.toolstack.redo()],
    ]);
  }

  update() {
    super.update();
    this.updateHeight();
  }
}

nstructjs.register(MainMenu);
Area.register(MainMenu);
