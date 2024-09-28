import { execSync } from "child_process";

export function isInstalled(command: string) {
  const result = execSync(
    `bash -c "${command} --version &> /dev/null && echo true || echo false"`,
    {
      stdio: "pipe",
    }
  );
  const bufferToString = result.toString("utf-8");
  try {
    return JSON.parse(bufferToString) as boolean;
  } catch (error) {
    console.log(error);
    return false;
  }
}
