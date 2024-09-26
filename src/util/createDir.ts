import fs from "fs";

export function createDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}
