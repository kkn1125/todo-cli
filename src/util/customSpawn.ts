import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export function customSpawn(
  cb: (spawn: ChildProcessWithoutNullStreams) => void,
  command: string,
  ...args: string[]
) {
  return new Promise((resolve) => {
    const cmd = spawn(command, args);
    cb(cmd);
    cmd.on("close", () => {
      resolve(true);
    });
  });
}
