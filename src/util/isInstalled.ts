import { execSync } from "child_process";
import path from "path";

export function isInstalled(command: string) {
  const checkInstallCliPath = path.join(path.resolve(), "scripts/isInstalled");
  const result = execSync(`sh ${checkInstallCliPath} ${command}`);
  const bufferToString = result.toString("utf-8");
  try {
    return JSON.parse(bufferToString) as boolean;
  } catch (error) {
    console.log(error);
    return false;
  }
}
