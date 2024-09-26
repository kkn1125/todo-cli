import {
  DATABASE_DIR,
  DATABASE_NAME,
  DATABASE_UPDATE_MESSAGE,
} from "@common/variables";
import path from "path";
import { customSpawn } from "./customSpawn";

export async function updateRemoteRepository() {
  await customSpawn("git", "add", path.join(DATABASE_DIR, DATABASE_NAME));
  await customSpawn("git", "commit", "-m", DATABASE_UPDATE_MESSAGE);
  await customSpawn("git", "push", "origin", "main");
}
