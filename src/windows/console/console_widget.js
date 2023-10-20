import {UIBase, util, math, nstructjs} from '../../../lib/pathux.js';
import {Console} from './console.js';


function isnum(c) {
  c = c.charCodeAt(0);
  let a = '0'.charCodeAt(0);
  let b = '9'.charCodeAt(0);

  return c >= a && c <= b;
}

export class ConsoleBuffer {
  constructor() {
    this.lines = [];
    this.scrollLine = 0;
    this.setScrollSize(100);
    this.cursor = [0, this.lines.length - 1];
  }

  setScrollSize(n) {
    const lines = this.lines;

    lines.length = n;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === undefined) {
        lines[i] = "";
      }
    }
  }
}

export class ConsoleEmulator extends UIBase {
  canvas = undefined;
  #last_sizekey = "";
  #drawreq = undefined;
  decodeState = undefined;
  lineSpacing = 1.25;
  colLimit = 100;

  constructor() {
    super();

    this.decodeState = undefined;

    this.buffer = new ConsoleBuffer();

    this.canvas = document.createElement("canvas");
    this.canvas.g = this.canvas.getContext("2d");
    this.fontSize = 20;

    this.shadow.appendChild(this.canvas);
  }

  init() {
    super.init();
    this.setCSS();
    this.tabIndex = 1;

    function makeStr(list) {
      return list.map(c => typeof c === "number" ? String.fromCharCode(c) : c).join("");
    }

    this.addEventListener("keydown", (e) => {
      console.log(e);

      let key = e.key;
      if (e.key === "Tab") {
        key = "\t";
      } else if (e.key === "Enter") {
        key = "\n";
      } else if (e.key === "ArrowLeft") {
        this.inputString(makeStr([0x1b, "[", "1", "D"]));
        return;
      } else if (e.key === "ArrowRight") {
        this.inputString(makeStr([0x1b, "[", "1", "C"]));
        return;
      }

      if (key.length === 1) {
        this.input(key);
        this.scrollIntoView();
      }

      e.stopPropagation();
      e.preventDefault();
    });
  }

  * decodeControl() {
    let n = yield;

    console.log("N", n);

    if (n === "[") {
      let params = [""];
      let endcode;

      while (1) {
        n = yield;

        if (isnum(n)) {
          params[params.length - 1] += n;
        } else if (n === ";") {
          params.push("");
        } else {
          endcode = n;
          break;
        }
      }

      params = params.map(p => p.length === 0 ? "0" : p).map(p => parseInt(p));
      console.log(params, endcode);

      let cursor = this.buffer.cursor;
      if (endcode === "D") { //left arrow
        if (params[0] === 0) {
          params[0] = 1;
        }

        cursor[0] = Math.max(cursor[0] - params[0], 0);
        this.redraw();
      } else if (endcode === "C") { //right arrow
        if (params[0] === 0) {
          params[0] = 1;
        }

        cursor[0] = Math.min(cursor[0] + params[0], this.colLimit);
        let li = this.buffer.cursor[1];
        while (this.buffer.lines[li].length < cursor[0]) {
          this.buffer.lines[li] += " ";
        }

        this.redraw();
      }
    }
  }

  inputString(s) {
    for (let i = 0; i < s.length; i++) {
      this.input(s[i]);
    }
  }

  input(key) {
    if (typeof key === "number") {
      key = String.fromCharCode(key);
    }
    
    if (this.decodeState) {
      console.log("key", key);
      let ret = this.decodeState.next(key);

      if (ret.done) {
        this.decodeState = undefined;
        return;
      } else {
        return;
      }
    }

    let cursor = this.buffer.cursor;
    let lines = this.buffer.lines;

    let code = key.charCodeAt(0);

    if (key === "\n") {
      lines.shift();
      lines.push("");
      cursor[0] = 0;
    } else if (key === "\r") {
      cursor[0] = 0;
    } else if (code === 0x08) { //Backspace
      cursor[0] = Math.max(cursor[0] - 1, 0);
    } else if (code === 0x1b) {
      this.decodeState = this.decodeControl();
      this.decodeState.next();
    } else {
      if (key === "\t") {
        key = " ";
      }
      if (cursor[0] < lines[cursor[1]].length) {
        let l = lines[cursor[1]];
        l = l.slice(0, cursor[0]) + key + l.slice(cursor[0] + 1, l.length);
        lines[cursor[1]] = l;

        cursor[0]++;
      } else {
        lines[cursor[1]] += key;
        cursor[0]++;
      }
    }

    this.redraw();
  }

  scrollIntoView() {
    this.buffer.scrollLine = this.buffer.cursor[1] + 1;
  }

  jumpScroll() {
    const dpi = UIBase.getDPI();
    const fsize = this.fontSize*dpi;
    const totline = Math.ceil(this.canvas.height/fsize);

    this.buffer.scrollLine = this.buffer.lines.length - 1;
  }

  draw() {
    this.#drawreq = undefined;

    let canvas = this.canvas;
    canvas.g.clearRect(0, 0, canvas.width, canvas.height);
    canvas.g.beginPath();
    canvas.g.fillStyle = "black";
    canvas.g.rect(0, 0, canvas.width, canvas.height);
    canvas.g.fill();

    canvas.g.fillStyle = "white";

    let dpi = UIBase.getDPI();
    let fsize = this.fontSize*dpi;
    let lineSpacing = this.lineSpacing*fsize;

    canvas.g.font = `${fsize}px mono`;

    let totline = Math.ceil(canvas.height/lineSpacing);
    let buf = this.buffer;
    let line_i = buf.scrollLine - totline + 1;
    const xpad = 5, ypad = 5;
    let x = xpad;
    let y = ypad;

    for (let i = 0; i <= totline; i++, line_i++) {
      if (line_i < 0 || line_i >= buf.lines.length) {
        continue;
      }

      const line = buf.lines[line_i];

      if (line_i === buf.cursor[1]) {
        let cx = xpad + fsize*buf.cursor[0];
        cx = canvas.g.measureText(line.slice(0, buf.cursor[0])).width;

        canvas.g.beginPath();
        canvas.g.rect(cx - 5, y - 2, 10, 4);
        canvas.g.fill();
      }

      canvas.g.fillText(line, x, y);
      y += lineSpacing;
    }
  }

  redraw() {
    if (this.#drawreq !== undefined) {
      return;
    }

    this.#drawreq = requestAnimationFrame(this.draw.bind(this));
  }

  updateSize() {
    super.update();

    let rect = this.getBoundingClientRect();
    if (!rect) {
      return;
    }

    const sizekey = "" + rect.width + ":" + rect.height;

    if (sizekey === this.#last_sizekey) {
      return;
    }
    this.#last_sizekey = sizekey;

    console.log("Update size", sizekey);

    let dpi = UIBase.getDPI();
    let w = ~~(rect.width*dpi);
    let h = ~~(rect.height*dpi);

    this.canvas.width = w;
    this.canvas.height = h;
    this.canvas.style["width"] = (w/dpi) + "px";
    this.canvas.style["height"] = (h/dpi) + "px";

    /* Jump to end of scrolling. */
    this.jumpScroll();

    /* Draw immediately. */
    this.draw();
  }

  update() {
    super.update();
    this.updateSize();
  }

  setCSS() {
    super.setCSS();

    this.style["margin"] = this.style["padding"] = "0px";
    this.canvas.style["margin"] = this.canvas.style["padding"] = "0px";
  }

  static define() {
    return {
      tagname: "console-emulator-x"
    }
  }
}

UIBase.register(ConsoleEmulator);
