import {AppArea} from '../area_base.js';
import {
  ScreenArea, Area, Screen, UIBase, util,
  math, nstructjs
} from '../../../lib/pathux.js';
import './console_widget.js';

export class Console extends AppArea {
  #last_sizekey = "";

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

    this.shadow.appendChild(this.container);
    this.container.add(this.console);
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

      this.console.style["width"] = (this.size[0]-pad) + "px";
      this.console.style["height"] = (this.size[1]-pad) + "px";
    }
  }
}

Area.register(Console);
