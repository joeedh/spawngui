import {Context, DataAPI, exportTheme, PackFlags} from '../../lib/pathux.js';

export function readXML(xml) {
  let parser = new DOMParser()
  return parser.parseFromString(xml.trim(), "application/xml");
}

class StackItem {
  constructor(container) {
    this.container = container;
  }

  copy() {
    return new StackItem(this.container);
  }
}

function getFloat(node, name, fallback) {
  if (node.hasAttribute(name)) {
    return parseFloat(node.getAttribute(name));
  } else {
    return fallback;
  }
}

function getBool(node, name, fallback = false) {
  if (node.hasAttribute(name)) {
    let s = node.getAttribute(name).trim().toLowerCase();
    return s === "true" || s === "yes" || s === "on" || s === "1" || s === "y";
  }

  return fallback;
}

export class WindowBuilder {
  root = undefined;
  container = undefined;
  stack = [];
  props = {};

  constructor(ctx, xmlbuf) {
    this.root = readXML(xmlbuf).childNodes[0];
    this.container = document.createElement("container-x");
    this.container.ctx = ctx;

    /* Build new data binding API. */
    this.api = _appstate.api = new DataAPI();

    class PropStructType {
    }

    this.apiStruct = this.api.mapStruct(PropStructType);

    let ctxStruct = this.api.mapStruct(Context);
    this.api.rootContextStruct = ctxStruct;
    ctxStruct.struct("props", "props", "props", this.apiStruct);

    ctx.props = this.props;
  }

  build() {
    this.visit(this.root);
  }

  exec(node = this.root) {
    if (node instanceof Text) {
      return;
    }
    let k = "_" + node.tagName.toLowerCase();

    if (this[k]) {
      this[k](node);
    }
  }

  visit(node) {
    for (let i = 0; i < node.childNodes.length; i++) {
      try {
        this.exec(node.childNodes[i]);
      } catch (error) {
        console.error(error.stack);
        console.error(error.message);
        this.container.label("error");

        this.visit(node);
      }
    }
  }

  handleNumProp(node, dpath) {
    function getattr(name, defval) {
      return node.hasAttribute(name) ? node.getAttribute(name) : defval;
    }

    let unit = getattr("unit", "none");
    let min = parseFloat(getattr("min", "-100000"));
    let max = parseFloat(getattr("max", "100000"));
    let dec = parseFloat(getattr("decimalPlaces", "2"));
    let slideSpeed = parseFloat(getattr("slideSpeed", "1.0"));
    let step = parseFloat(getattr("step", "0.1"));

    console.log(min, max, unit);
    dpath.baseUnit(unit)
      .displayUnit(unit)
      .range(min, max)
      .decimalPlaces(dec)
      .slideSpeed(slideSpeed)
      .step(step)
      .simpleSlider(true)
  }

  handleBasicProp(node, dpath) {
    if (node.hasAttribute("uiName")) {
      dpath.data.uiname = node.getAttribute("uiName");
    }
  }

  _float(node) {
    let name = node.getAttribute("name");
    this.props[name] = getFloat(node, "value", 0);
    let dpath = this.apiStruct.float(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    let elem;
    if (getBool(node, "slider")) {
      elem = this.container.slider(`props.${name}`);
    } else {
      elem = this.container.simpleslider(`props.${name}`);
    }
  }

  _bool(node) {
    let name = node.getAttribute("name");
    this.props[name] = getBool(node, "value", false);
    let dpath = this.apiStruct.bool(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);

    this.container.prop(`props.${name}`);
  }

  _panel(node) {
    let name = node.getAttribute("name");

    let panel = this.container.panel(name);
    if (getBool(node, "collapsed")) {
      panel.closed = true;
    }

    this.push(panel);
    this.visit(node);
    this.pop();
  }

  push(con) {
    this.stack.push(new StackItem(this.container));
    this.container = con;
  }

  pop() {
    this.container = this.stack.pop().container;
  }

  _theme_editor() {
    this.container.button("Export Theme", () => {
      let s = "import {CSSFont} from '../lib/pathux.js';\nexport " + exportTheme();
      console.log(s);
    });

    this.container.appendChild(document.createElement("theme-editor-x"));
  }
}
