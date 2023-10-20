import {Vector2, Vector3, Vector4} from '../../lib/pathux.js';

export function execProcess(ctx, cmd, props) {
  const child_process = require("child_process");

  for (let k in props) {
    let p = props[k];

    if (p instanceof Array || p instanceof Vector2 || p instanceof Vector3 || p instanceof Vector4) {
      for (let i = 0; i < p.length; i++) {
        let re = new RegExp(`\\$${k}\\[${i}\\]`, "g");
        cmd = cmd.replace(re, p[i]);
      }
    } else {
      let re = new RegExp(`\\$${k}`, "g");
      cmd = cmd.replace(re, p);
    }
  }

  ctx.screen.ensureConsole();

  function output(str) {
    ctx.console.inputString(str);
  }

  cmd = cmd.split(" ").map(arg => arg.trim());
  console.log("Run process!", cmd, props);

  let proc = child_process.spawn(cmd[0], cmd.splice(1, cmd.length));

  proc.stdout.on("data", (s) => {
    output(s);
  });

  proc.stderr.on("data", (s) => {
    output(s);
  });

  proc.on("close", (code) => {
    output("process exited with code " + code + "\n");
  });
}
