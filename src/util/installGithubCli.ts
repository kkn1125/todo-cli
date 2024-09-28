import { isInstalled } from "./isInstalled";

export function installGithubCli() {
  const isInstalledChoco = isInstalled("choco");
  return isInstalledChoco;
}
