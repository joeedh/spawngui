import {ScreenArea, Area, Screen, UIBase} from '../../lib/pathux.js';
import {AppArea} from './area_base.js';
import {WindowBuilder} from './parsexml.js';

export class AppScreen extends Screen {
  static define() {
    return {
      tagname: "app-screen-x"
    }
  }
}

UIBase.register(AppScreen);

export class Window extends AppArea {
  static define() {
    return {
      areaname: "window",
      uiname  : "Window",
      tagname : "window-x"
    }
  }

  constructor() {
    super();

    this.container = document.createElement("container-x");
    this.shadow.appendChild(this.container);
  }

  init() {
    super.init();

    this.header = this.container;
    this.setCSS();
  }

  setCSS() {
    super.setCSS();
    this.style["overflow"] = "scroll";
  }

  loadXML(xmlbuf) {
    let builder = new WindowBuilder(this.ctx, xmlbuf);
    this.shadow.appendChild(builder.container);

    builder.build();

    this.ctx.theme.completeUpdate();
    this.ctx.theme.completeUpdate();
  }
}

Area.register(Window);
