import {contextWrangler, Context, ContextOverlay} from '../../lib/pathux.js';
import {AppArea} from '../windows/area_base.js';
import {Sheet} from '../windows/sheet/sheet.js';
import {Console} from '../windows/console/console.js';

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
    return AppArea.getLastArea(Sheet);
  }

  get console() {
    return AppArea.getLastArea(Console);
  }

  get props() {
    return this.builder.props;
  }

  get builder() {
    return this.state.builder;
  }

  toLocked() {
    return this;
  }
}
