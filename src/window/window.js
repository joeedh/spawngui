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

  saveData(sampleCurves=false) {
    return this.builder.saveData(this.ctx, sampleCurves);
  }

  loadXML(xmlbuf) {
    let builder = this.builder = new WindowBuilder(this.ctx, xmlbuf);
    this.shadow.appendChild(builder.container);
    builder.container.style["margin-left"] = "10px";

    builder.build();

    this.ctx.screen.completeUpdate();
    this.ctx.screen.completeUpdate();
  }
}

Area.register(Window);
