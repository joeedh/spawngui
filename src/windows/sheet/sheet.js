import {ScreenArea, Area, Screen, UIBase} from '../../../lib/pathux.js';
import {AppArea} from '../area_base.js';
import {WindowBuilder} from '../../core/parsexml.js';

export class Sheet extends AppArea {
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

  savePropData(sampleCurves=false) {
    return this.builder.saveData(this.ctx, sampleCurves);
  }

  get builder() {
    return this.ctx.state.builder;
  }

  loadBuilder(builder) {
    if (builder.container) {
      this.shadow.appendChild(builder.container);
    }

    for (let i=0; i<3; i++) {
      this.ctx.screen.completeUpdate();
    }
  }

  loadXML(xmlbuf) {
    let oldProps = Object.assign({}, this.ctx.builder.props);

    let builder = this.ctx.state.builder = new WindowBuilder(this.ctx, xmlbuf);
    this.ctx.state.api = builder.api;

    this.shadow.appendChild(builder.container);
    builder.container.style["margin-left"] = "10px";

    builder.build();

    for (let k in oldProps) {
      if (k in builder.props) {
        builder.props[k] = oldProps[k];
      } else {
        console.error("Orphaned property " + k);
      }
    }

    for (let i=0; i<3; i++) {
      this.ctx.screen.completeUpdate();
    }
  }
}

Area.register(Sheet);
