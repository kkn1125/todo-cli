import { execSync } from "child_process";
import path from "path";

export function pullRemoteDatabase() {
  const result = execSync('gh auth status | grep -ioe "account .*\\s"');
  const repoInfo = execSync("gh repo view --json name");
  const { name: repoName } = JSON.parse(repoInfo.toString("utf-8"));
  const stringSet = result.toString("utf-8").trim().split(" ");
  const { account } = Object.fromEntries([stringSet]);
  execSync(
    `curl https://raw.githubusercontent.com/${account}/${repoName}/refs/heads/main/database/todo_list.json -o ${path.join(
      path.resolve(),
      "database/todo_list.json"
    )}`,
    { encoding: "utf-8" }
  );
}
