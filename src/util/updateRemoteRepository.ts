import {
  DATABASE_DIR,
  DATABASE_NAME,
  DATABASE_UPDATE_MESSAGE,
} from "@common/variables";
import path from "path";
import { customSpawn } from "./customSpawn";
import { execSync } from "child_process";

export async function updateRemoteRepository() {
  // await customSpawn("git", "add", path.join(DATABASE_DIR, DATABASE_NAME));
  // await customSpawn("git", "commit", "-m", DATABASE_UPDATE_MESSAGE);
  // await customSpawn("git", "push", "origin", "main");
  try {
    const result = execSync('gh auth status | grep -ioe "account .*\\s"');
    const repoInfo = execSync("gh repo view --json name");
    const { name: repoName } = JSON.parse(repoInfo.toString("utf-8"));
    const stringSet = result.toString("utf-8").trim().split(" ");
    // console.log("stringSet", stringSet);
    const { account } = Object.fromEntries([stringSet]);
    // console.log(account, repoName);
    const base64 = execSync(`base64 -w 0 database/todo_list.json`);
    const sha = execSync(
      `gh api repos/${account}/${repoName}/contents/database/todo_list.json --jq .sha`,
      {
        stdio: "pipe",
      }
    );
    execSync(
      `gh api -X PUT -H "Content-Type: application/json" repos/${account}/${repoName}/contents/database/todo_list.json -F message="${DATABASE_UPDATE_MESSAGE}" -F content="${base64.toString(
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
