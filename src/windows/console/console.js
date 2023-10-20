import {AppArea} from '../area_base.js';
import {
  ScreenArea, Area, Screen, UIBase, util,
  math, nstructjs
} from '../../../lib/pathux.js';
import './console_widget.js';
import {Icons} from '../../../assets/icon_enum.js';

const MINSIZE = 42;

export class Console extends AppArea {
  #last_sizekey = "";

  static STRUCT = nstructjs.inherit(Console, AppArea) + `
}`;

  static define() {
    return {
      areaname: "console",
      uiname  : "Console",
      tagname : "console-window-x"
    }
  }

  constructor() {
    super();

    this.container = document.createElement("container-x");
    this.console = document.createElement("console-emulator-x");

    let header = document.createElement("rowframe-x");
    this.container.appendChild(header);
    header.style["margin-left"] = "15px";

    this.closed = false;

    let last_closed = undefined;
    let icon = header.iconbutton(Icons.CHEVRON_DOWN, "Toggle Console", () => {
      this.toggleHide();
    }).update.after(() => {
      if (this.closed !== last_closed) {
        last_closed = this.closed;
        icon.icon = this.closed ? Icons.CHEVRON_UP : Icons.CHEVRON_DOWN;
      }
    });

    header.label("Console");

    this.shadow.appendChild(this.container);
    this.container.add(this.console);

    this.lastHeight = 100;
    this.maxSize = [undefined, undefined];
  }

  get collapsed() {
    return this.maxSize[1] !== undefined;
  }

  inputString(buf) {
    this.console.inputString(buf);
  }

  scrollIntoView() {
    this.console.scrollIntoView();
  }

  toggleHide() {
    let clearLastHeight = false;

    if (this.maxSize[1]) {
      this.maxSize[1] = undefined;
      /* Restore last height with minSize. */
      this.minSize[1] = this.lastHeight;
      this.closed = false;
      clearLastHeight = true;
    } else {
      this.lastHeight = this.parentWidget.size[1];
      this.maxSize[1] = MINSIZE;
      this.closed = true;
    }

    this.ctx.screen.solveAreaConstraints();
    this.ctx.screen.regenScreenMesh();

    if (clearLastHeight) {
      this.minSize[1] = MINSIZE;
    }
  }

  init() {
    super.init();

    this.header = this.container;
    this.setCSS();
  }

  setCSS() {
    super.setCSS();
    this.style["overflow"] = "hidden";
  }

  update() {
    let sizekey = "" + this.size[0] + ":" + this.size[1];
    if (sizekey !== this.#last_sizekey) {
      this.#last_sizekey = sizekey;

      //Avoid scrollbars
      let pad = 5;

      this.console.style["width"] = (this.size[0] - pad) + "px";
      this.console.style["height"] = (this.size[1] - pad) + "px";
    }
  }
}

nstructjs.register(Console);
Area.register(Console);
