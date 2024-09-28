import os from "os";

export function getCurrentOS() {
  const platform = os.platform();
  return platform;
}
