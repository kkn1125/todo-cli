import fs from "fs";
import path from "path";

export function updateFile<T extends object>(
  dir: string,
  filename: string,
  data: T
) {
  const filePath = path.join(dir, filename);
  const dataBuffer = Buffer.from(JSON.stringify(data, null, 2));
  fs.writeFileSync(filePath, dataBuffer, { encoding: "utf-8" });
}
