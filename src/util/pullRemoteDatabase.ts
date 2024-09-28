import { ACCOUNT, REPO_NAME } from "@common/variables";
import { execSync } from "child_process";
import path from "path";

export function pullRemoteDatabase() {
  execSync(
    `curl https://raw.githubusercontent.com/${ACCOUNT}/${REPO_NAME}/refs/heads/main/database/todo_list.json -o ${path.join(
      path.resolve(),
      "database/todo_list.json"
    )}`,
    { encoding: "utf-8" }
  );
}
