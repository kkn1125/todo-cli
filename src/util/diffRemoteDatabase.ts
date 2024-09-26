import { execSync } from "child_process";

export async function diffRemoteDatabase() {
  const length = execSync(
    // "git diff --name-only origin/main -- database/todo_list.json | wc -l"
    "git diff origin/main -- database/todo_list.json | wc -l"
  );
  const diffLength = length.toString("utf-8");
  if (!diffLength) {
    return 0;
  }
  return Math.ceil((+diffLength - 11) / 7);
}
