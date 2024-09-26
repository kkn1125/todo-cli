import { DATABASE_DIR, DATABASE_NAME, GlobalState } from "@common/variables";
import { counterDown } from "@src/util/counterDown";
import { counterUp } from "@src/util/counterUp";
import { loadFile } from "@src/util/loadFIle";
import { updateFile } from "@src/util/updateFile";
import { updateRemoteRepository } from "@src/util/updateRemoteRepository";
import Todo from "./Todo";
import { ITodoList } from "./interface/ITodoList";
import { TodoCounter } from "./types/TodoCounter";

export default class TodoManager {
  data: ITodoList = {
    list: [],
    createdAt: new Date(),
  };

  init() {
    updateFile(DATABASE_DIR, DATABASE_NAME, this.data);
  }

  add(content: string) {
    const todo = new Todo(content);
    this.data.list.push(todo);

    counterUp("New");
  }

  deleteById(id: string) {
    this.data.list = this.data.list.filter((todo) => todo.id !== id);
    counterDown("Delete");
  }

  load() {
    loadFile(DATABASE_DIR, DATABASE_NAME);
  }

  saveToLocal() {
    updateFile(DATABASE_DIR, DATABASE_NAME, this.data);
  }

  saveToRepository() {
    updateRemoteRepository();
    GlobalState.TodoManagerState = "pushed";
  }

  /* --- */

  counterUp(key: keyof TodoCounter) {
    this.counter[key] += 1;
  }

  counterDown(key: keyof TodoCounter) {
    this.counter[key] -= 1;
  }

  /* --- */

  findAll() {
    return this.data.list;
  }
}
