import { ITodoList } from "@module/interface/ITodoList";
import fs from "fs";
import path from "path";

export function loadFile(dir: string, filename: string): ITodoList {
  const filePath = path.join(dir, filename);
  const dataBuffer = fs.readFileSync(filePath);
  return JSON.parse(dataBuffer.toString("utf-8"));
}
