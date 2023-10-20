/* Save screen layout */

import {nstructjs, ToolProperty} from '../../lib/pathux.js';

export const FILE_VERSION = 0.0;
export const FILE_MAGIC = "SPWN";

class FileHeader {
  static STRUCT = `
FileHeader {
  magic     : static_string[4];
  version   : float;
  flags     : int;
  structDef : string;
}
  `;

  magic = FILE_MAGIC;
  version = FILE_VERSION;
  flags = 0;
  structDef = "";
}

nstructjs.register(FileHeader);


class FileData {
  static STRUCT = `
FileData {
  screen      : AppScreen;
  xmlFilePath : string;
  props       : array(abstract(ToolProperty)) | this._save_props();    
}
  `;

  app = undefined;
  screen = undefined;
  xmlFilePath = "";
  props = [];
  saveProps = true;

  constructor(app) {
    this.app = app;
  }

  _save_props() {
    if (!this.saveProps) {
      return [];
    }

    let props = [];

    for (let k in this.app.builder.propDefs) {
      let dpath = this.app.builder.propDefs[k];

      if (!(dpath.data instanceof ToolProperty)) {
        continue;
      }

      let prop = dpath.data.copy();

      prop.setValue(this.app.builder.props[k]);
      props.push(prop);
    }

    return props;
  }

  loadSTRUCT(reader) {
    reader(this);
  }
}

nstructjs.register(FileData);

class FileOptions {
  JSON = false;
  saveProps = true;
  loadScreen = true;
  loadProps = false;

  constructor(options = {}) {
    for (let k in options) {
      if (this[k] === undefined) {
        console.error("Unknown option " + k);
        continue;
      }

      this[k] = options[k];
    }
  }
}

export function saveAppFile(app, options = new FileOptions()) {
  if (!(options instanceof FileOptions)) {
    options = new FileOptions(options);
  }

  let header = new FileHeader();
  header.structDef = nstructjs.write_scripts();

  let file = new FileData(app);
  file.screen = app.screen;
  file.xmlFilePath = app.xmlPath;
  file.saveProps = options.saveProps;

  if (!options.JSON) {
    let data = [];
    nstructjs.writeObject(data, header);
    nstructjs.writeObject(data, file);
    return new Uint8Array(data).buffer;
  } else {
    let data = {};
    data.header = nstructjs.writeJSON(header);
    data.data = nstructjs.writeJSON(file);
    return data;
  }
}

export function loadAppFile(app, data, options = new FileOptions) {
  if (!(options instanceof FileOptions)) {
    options = new FileOptions(options);
  }

  if (data instanceof ArrayBuffer) {
    data = new DataView(data);
  }

  let header;
  let uctx = new nstructjs.unpack_context();

  if (options.JSON) {
    header = nstructjs.readJSON(data.header, FileHeader);
  } else {
    header = nstructjs.readObject(data, FileHeader, uctx);
  }

  if (header.magic !== FILE_MAGIC) {
    console.log(header);
    throw new Error("Invalid file");
  }

  let struct = new nstructjs.STRUCT();
  struct.parse_structs(header.structDef);

  let file;

  console.log(header);
  if (options.JSON) {
    file = nstructjs.readJSON(data.data, FileData);
  } else {
    file = nstructjs.readObject(data, FileData, uctx);
  }

  console.log("file", file);

  if (options.loadScreen) {
    if (app.screen) {
      app.screen.unlisten();
      app.screen.remove();
    }

    app.screen = file.screen;
    file.screen.ctx = app.ctx;
    document.body.appendChild(app.screen);

    try {
      app.screen.loadBuilder(app.builder);
    } catch (error) {
      console.error(error.stack);
      console.error(error.message);
    }

    app.screen.listen();
    app.screen.completeUpdate();
    app.screen.completeUpdate();
  }

  return file;
}

