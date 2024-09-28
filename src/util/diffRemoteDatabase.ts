import { ACCOUNT, REPO_NAME } from "@common/variables";
import { ITodoList } from "@module/interface/ITodoList";
import { execSync } from "child_process";

export async function diffRemoteDatabase(currentData: ITodoList) {
  const origin = execSync(
    `curl https://raw.githubusercontent.com/${ACCOUNT}/${REPO_NAME}/refs/heads/main/database/todo_list.json`,
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
