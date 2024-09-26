import { spawn } from "child_process";

export function customSpawn(command: string, ...args: string[]) {
  return new Promise((resolve) => {
    const cmd = spawn(command, args);
    cmd.on("close", () => {
      resolve(true);
    });
  });
}
