import { ACCOUNT, DATABASE_UPDATE_MESSAGE, REPO_NAME } from "@common/variables";
import { execSync } from "child_process";

export async function updateRemoteRepository() {
  try {
    const base64 = execSync(`base64 -w 0 database/todo_list.json`);
    const sha = execSync(
      `gh api repos/${ACCOUNT}/${REPO_NAME}/contents/database/todo_list.json --jq .sha`,
      {
        stdio: "pipe",
      }
    );
    execSync(
      `gh api -X PUT repos/${ACCOUNT}/${REPO_NAME}/contents/database/todo_list.json -F message="${DATABASE_UPDATE_MESSAGE}" -F content="${base64.toString(
        "utf-8"
      )}" -F sha="${sha.toString("utf-8")}"`,
      {
        stdio: "pipe",
      }
    );
  } catch (error) {
    console.log("not logged in", error);
    return null;
  }
}
