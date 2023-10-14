import {contextWrangler, Context, ContextOverlay} from '../../lib/pathux.js';
import {AppArea} from '../window/area_base.js';
import {Window} from '../window/window.js';

export class AppContext {
  get state() {
    return window._appstate;
  }

  get api() {
    return window._appstate.api;
  }

  get screen() {
    return window._appstate.screen;
  }

  get toolstack() {
    return window._appstate.toolstack;
  }

  get window() {
    return AppArea.getLastArea(Window);
  }

  props = {};

  toLocked() {
    return this;
  }
}
