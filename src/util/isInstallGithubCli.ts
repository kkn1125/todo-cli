import { execSync } from "child_process";
import path from "path";

export function isInstallGithubCli() {
  const checkInstallCliPath = path.join(
    path.resolve(),
    "scripts/isInstallGithubCli"
  );
  const result = execSync(`sh ${checkInstallCliPath}`);
  const bufferToString = result.toString("utf-8");
  try {
    return JSON.parse(bufferToString) as boolean;
  } catch (error) {
    console.log(error);
    return false;
  }
}
