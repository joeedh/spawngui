import {Area, contextWrangler} from '../../lib/pathux.js';

export class AppArea extends Area {
  push_ctx_active(dontSetLastRef = false) {
    contextWrangler.updateLastRef(this.constructor, this);
    contextWrangler.push(this.constructor, this, !dontSetLastRef);
  }

  /**
   * see push_ctx_active
   * */
  pop_ctx_active(dontSetLastRef = false) {
    contextWrangler.pop(this.constructor, this, !dontSetLastRef);
  }

  static getLastArea(type) {
    return contextWrangler.getLastArea(type);
  }

  getScreen() {
    return this.ctx.screen;
  }
}
