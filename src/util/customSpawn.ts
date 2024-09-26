import { ChildProcessWithoutNullStreams, spawn } from "child_process";

export function customSpawn(command: string, ...args: string[]) {
  return new Promise<ChildProcessWithoutNullStreams>((resolve) => {
    const cmd = spawn(command, args);
    const copy = Object.assign({}, cmd);
    cmd.on("close", () => {
      resolve(copy);
    });
  });
}
