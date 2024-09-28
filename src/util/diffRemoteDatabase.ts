import { ITodoList } from "@module/interface/ITodoList";
import { execSync } from "child_process";

export async function diffRemoteDatabase(currentData: ITodoList) {
  // const length = execSync(
  //   // "git diff --name-only origin/main -- database/todo_list.json | wc -l"
  //   "git diff origin/main -- database/todo_list.json | wc -l"
  // );
  // const diffLength = length.toString("utf-8");
  // if (!diffLength) {
  //   return 0;
  // }
  // return Math.ceil((+diffLength - 11) / 7);
  const result = execSync('gh auth status | grep -ioe "account .*\\s"');
  const repoInfo = execSync("gh repo view --json name");
  const { name: repoName } = JSON.parse(repoInfo.toString("utf-8"));
  const stringSet = result.toString("utf-8").trim().split(" ");
  const { account } = Object.fromEntries([stringSet]);
  const origin = execSync(
    `curl https://raw.githubusercontent.com/${account}/${repoName}/refs/heads/main/database/todo_list.json`,
    {
      stdio: "pipe",
    }
  );
  const originData = JSON.parse(origin.toString("utf-8")) as ITodoList;
  if (originData.list.length != currentData.list.length) {
    return currentData.list.length - originData.list.length;
  }
  return 0;
}
