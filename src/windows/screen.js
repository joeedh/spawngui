import {Screen, UIBase, nstructjs} from '../../lib/pathux.js';
import {Console} from './console/console.js';
import {Sheet} from './sheet/sheet.js';

export class AppScreen extends Screen {
  static STRUCT = nstructjs.inherit(AppScreen, Screen) + `
}`;

  static define() {
    return {
      tagname: "app-screen-x"
    }
  }

  ensureConsole() {
    for (let sarea of this.sareas) {
      if (sarea.area instanceof Console) {
        if (sarea.area.collapsed) {
          sarea.area.toggleHide();
        }
        return;
      }
    }

    let sarea = this.ctx.window.parentWidget;
    console.log("sarea", sarea);
    let sarea2 = this.splitArea(sarea, 0.6);

    sarea2.switchEditor(Console);
  }

  toggleConsole() {
    for (let sarea of this.sareas) {
      if (sarea.area instanceof Console) {
        sarea.area.toggleHide();
        return;
      }
    }

    let sarea = this.ctx.window.parentWidget;
    console.log("sarea", sarea);
    let sarea2 = this.splitArea(sarea, 0.6);

    sarea2.switchEditor(Console);
  }

  loadBuilder(builder) {
    this.ctx.state.builder = builder;
    this.ctx.state.api = builder.api;

    for (let sarea of this.sareas) {
      if (sarea.area instanceof Sheet) {
        let sheet = sarea.area;
        sheet.loadBuilder(builder);
      }
    }
  }
}

nstructjs.register(AppScreen);
UIBase.register(AppScreen);
