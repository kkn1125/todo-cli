import { execSync } from "child_process";

export async function diffRemoteDatabase() {
  const length = execSync(
    "git diff --name-only origin/main -- database/todo_list.json | wc -l"
  );
  return +(length.toString("utf-8") || 0);
}
