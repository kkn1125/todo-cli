import { exec, execSync } from "child_process";

export function installChoco() {
  return new Promise((resolve, reject) => {
    exec(
      `powershell "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"`,
      (err, stdout, stderr) => {
        // console.log(stdout);
        if (err || stderr) {
          reject(err);
        }
        resolve(true);
      }
    );
  })
    .then((next) => {
      if (next) {
        const result = execSync("choco install gh -y");
        console.log(result.toString("utf-8"));
        return true;
      }
    })
    .catch((err) => {
      console.log("error installing choco:", err);
      if (err.includes("An existing Chocolatey installation was detected.")) {
        const result = execSync("choco install gh -y");
        console.log(result.toString("utf-8"));
        return true;
      }
    });
}
