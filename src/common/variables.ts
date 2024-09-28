import { TodoCounter } from "@module/types/TodoCounter";
import { TodoManagerState } from "@module/types/TodoManagerState";
import path from "path";

export const DATABASE_DIR = path.join(path.resolve(), "database");
export const DATABASE_NAME = "todo_list.json";
export const DATABASE_UPDATE_MESSAGE =
  "🗂️ db update(automation): commit for todo_list update";
export const INPUT_NEXT_LINE = "\n> ";
export const PER_PAGE = 9;
export const GlobalState: {
  TodoManagerState: TodoManagerState;
  Counter: TodoCounter;
} = {
  TodoManagerState: "pulled",
  Counter: {
    New: 0,
    Update: 0,
    Delete: 0,
  },
};
export const ACCOUNT = process.env.ACCOUNT;
export const REPO_NAME = process.env.REPO_NAME;
