import {Window} from '../window/window.js';
import {DataAPI, ToolStack} from '../../lib/pathux.js';
import {AppContext} from './context.js';
import {MainMenu} from '../window/menu.js';

export class App {
  screen = undefined;
  toolstack = undefined;
  ctx = new AppContext();
  api = new DataAPI();

  constructor() {
    this.toolstack = new ToolStack(this.ctx);
  }

  makeScreen() {
    let screen = document.createElement("app-screen-x");
    let sarea = document.createElement("screenarea-x");

    screen.ctx = this.ctx;
    sarea.ctx = this.ctx;

    screen.appendChild(sarea);
    sarea.switchEditor(Window);

    let sarea2 = screen.splitArea(sarea, 0.1, true);
    sarea.switchEditor(MainMenu);

    if (this.screen) {
      this.screen.unlisten();
      this.screen.remove();
    }

    document.body.style["margin"] = document.body.style["padding"] = "0px";

    document.body.appendChild(screen);

    this.screen = screen;
    this.screen.listen();
    this.screen.completeUpdate();
  }
}
