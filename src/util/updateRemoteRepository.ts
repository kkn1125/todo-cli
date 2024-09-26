import {
  DATABASE_DIR,
  DATABASE_NAME,
  DATABASE_UPDATE_MESSAGE,
} from "@common/variables";
import path from "path";
import { customSpawn } from "./customSpawn";

export async function updateRemoteRepository() {
  await customSpawn(
    () => {
      console.log("git check...");
    },
    "git",
    "add",
    path.join(DATABASE_DIR, DATABASE_NAME)
  );
  await customSpawn(
    () => {
      console.log("git check...");
    },
    "git",
    "commit",
    "-m",
    DATABASE_UPDATE_MESSAGE
  );
  await customSpawn(
    () => {
      console.log("git check...");
    },
    "git",
    "push",
    "origin",
    "main"
  );
}
