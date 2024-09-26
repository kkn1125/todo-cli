import fs from "fs";
import path from "path";

export function checkDatabase() {
  return fs.existsSync(path.join(path.resolve(), "database"));
}
