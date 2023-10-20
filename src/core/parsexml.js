import {
  Context, DataAPI, exportTheme, PackFlags,
  Vector2, Vector3, Vector4, nstructjs,
  Curve1D
} from '../../lib/pathux.js';
import {execProcess} from './process.js';

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

function getInt(node, name, fallback) {
  if (node.hasAttribute(name)) {
    return parseInt(node.getAttribute(name));
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
    if (xmlbuf) {
      this.root = readXML(xmlbuf).childNodes[0];
      this.container = document.createElement("container-x");
      this.container.ctx = ctx;
    }

    /* Build new data binding API. */
    this.api = new DataAPI();

    class PropStructType {
    }

    this.propDefs = {};

    this.apiStruct = this.api.mapStruct(PropStructType);

    let ctxStruct = this.api.mapStruct(Context);
    this.api.rootContextStruct = ctxStruct;
    ctxStruct.struct("props", "props", "props", this.apiStruct);
  }

  saveData(ctx, sampleCurves = false) {
    let props = ctx.props;
    let ret = {};

    for (let k in this.propDefs) {
      let dpath = this.propDefs[k];
      let v = props[k];

      if (typeof v === "number" || typeof v === "boolean") {
        ret[k] = v;
      } else if (v instanceof Vector2 || v instanceof Vector3 || v instanceof Vector4) {
        ret[k] = Array.from(v);
      } else if (v instanceof Curve1D) {
        if (sampleCurves) {
          console.log(dpath);

          let tot = dpath.samplePoints;
          let t = dpath.xmin;
          let dt = (dpath.xmax - dpath.xmin)/(tot - 1);
          ret[k] = [];

          for (let i = 0; i < tot; i++, t += dt) {
            ret[k].push(v.evaluate(t));
          }
        } else {
          ret[k] = nstructjs.writeJSON(v);
        }
      }
    }

    return ret;
  }

  build() {
    this.visit(this.root);
  }

  exec(node = this.root) {
    if (node instanceof Text || node instanceof Comment) {
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

        for (let i = 0; i < node.childNodes; i++) {
          this.visit(node.childNodes[i]);
        }
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

    if (getBool(node, "slider")) {
      dpath.simpleSlider(true);
    }
  }

  handleBasicProp(node, dpath) {
    if (node.hasAttribute("uiName")) {
      dpath.data.uiname = node.getAttribute("uiName");
    }

    if (node.hasAttribute("description")) {
      dpath.description(node.getAttribute("description"));
    } else if (node.hasAttribute("tooltip")) {
      dpath.description(node.getAttribute("tooltip"));
    }
  }

  _float(node) {
    let name = node.getAttribute("name");
    this.props[name] = getFloat(node, "value", 0);
    let dpath = this.apiStruct.float(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    this.container.slider(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _int(node) {
    let name = node.getAttribute("name");
    this.props[name] = Math.floor(getFloat(node, "value", 0));
    let dpath = this.apiStruct.int(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    this.container.slider(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _vec2(node) {
    let name = node.getAttribute("name");
    this.props[name] = new Vector2([
      getFloat(node, "x", 0),
      getFloat(node, "y", 0)
    ]);

    let dpath = this.apiStruct.vec2(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    this.container.prop(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _vec3(node) {
    let name = node.getAttribute("name");
    this.props[name] = new Vector3([
      getFloat(node, "x", 0),
      getFloat(node, "y", 0),
      getFloat(node, "z", 0)
    ]);

    let dpath = this.apiStruct.vec3(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    this.container.prop(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _vec4(node) {
    let name = node.getAttribute("name");
    this.props[name] = new Vector4([
      getFloat(node, "x", 0),
      getFloat(node, "y", 0),
      getFloat(node, "z", 0),
      getFloat(node, "w", 0)
    ]);

    let dpath = this.apiStruct.vec4(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.handleNumProp(node, dpath);

    this.container.prop(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _color(node) {
    let name = node.getAttribute("name");
    this.props[name] = new Vector4([
      getFloat(node, "r", 0),
      getFloat(node, "g", 0),
      getFloat(node, "b", 0),
      getFloat(node, "a", 0)
    ]);

    let dpath = this.apiStruct.color4(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);

    this.container.prop(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _curve(node) {
    let name = node.getAttribute("name");
    this.props[name] = new Curve1D();

    let dpath = this.apiStruct.curve1d(name, name, name);
    this.handleBasicProp(node, dpath);
    dpath.samplePoints = getInt(node, "samplePoints", 10);
    dpath.xmin = getFloat(node, "xmin", 0);
    dpath.xmax = getFloat(node, "xmax", 1);
    dpath.ymin = getFloat(node, "ymin", 0);
    dpath.ymax = getFloat(node, "ymax", 1);

    let panel = this.container.panel(name);
    panel.closed = getBool(node, "collapsed", true);

    panel.curve1d(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _bool(node) {
    let name = node.getAttribute("name");
    this.props[name] = getBool(node, "value", false);

    let dpath = this.apiStruct.bool(name, name, ToolProperty.makeUIName(name));

    this.handleBasicProp(node, dpath);
    this.container.prop(`props.${name}`);
    this.propDefs[name] = dpath;
  }

  _process(node) {
    let name = node.getAttribute("name");
    let cmd = node.getAttribute("cmd");

    this.container.button(name, () => {
      execProcess(this.container.ctx, cmd, this.props);
    });
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
