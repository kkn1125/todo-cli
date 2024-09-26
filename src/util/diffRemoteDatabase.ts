import { ChildProcessWithoutNullStreams } from "child_process";
import { customSpawn } from "./customSpawn";

export async function diffRemoteDatabase(
  cb: (cmd: ChildProcessWithoutNullStreams) => void
) {
  const spawn = await customSpawn(
    cb,
    "git",
    "diff",
    "--name-only",
    "origin/main",
    "--",
    "database/todo_list.json",
    "|",
    "wc",
    "-l"
  );
}
