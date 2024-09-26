import { DATABASE_DIR, DATABASE_NAME, GlobalState } from "@common/variables";
import { counterDown } from "@src/util/counterDown";
import { counterUp } from "@src/util/counterUp";
import { loadFile } from "@src/util/loadFIle";
import { updateFile } from "@src/util/updateFile";
import { updateRemoteRepository } from "@src/util/updateRemoteRepository";
import Todo from "./Todo";
import { ITodoList } from "./interface/ITodoList";
import { TodoCounter } from "./types/TodoCounter";
import { checkDatabase } from "@src/util/checkDatabase";
import { Process } from "./enum/Process";

export default class TodoManager {
  data: ITodoList = {
    list: [],
    createdAt: new Date(),
  };

  constructor() {
    this.load();
  }

  private load() {
    if (this.checkDatabase()) {
      const data = loadFile(DATABASE_DIR, DATABASE_NAME);
      this.data = data;
    } else {
      this.init();
    }
  }

  private checkDatabase() {
    return checkDatabase();
  }

  private init() {
    updateFile(DATABASE_DIR, DATABASE_NAME, this.data);
  }

  add(content: string) {
    const todo = new Todo(content);
    this.data.list.push(todo);

    counterUp("New");
    this.saveToLocal();
  }

  deleteById(id: string) {
    this.data.list = this.data.list.filter((todo) => todo.id !== id);
    counterDown("Delete");
    this.saveToLocal();
  }

  saveToLocal() {
    updateFile(DATABASE_DIR, DATABASE_NAME, this.data);
  }

  async saveToRepository() {
    await updateRemoteRepository();
    GlobalState.TodoManagerState = "pushed";
  }

  /* --- */

  counterUp(key: keyof TodoCounter) {
    GlobalState.Counter[key] += 1;
  }

  counterDown(key: keyof TodoCounter) {
    GlobalState.Counter[key] -= 1;
  }

  /* --- */

  findAll() {
    return this.data.list;
  }

  findOne(id: string) {
    return this.data.list.find((todo) => todo.id === id);
  }

  update(id: string, data: Todo) {
    const todo = this.findOne(id);
    if (todo) {
      Object.assign(todo, data);
      todo.updatedAt = new Date();
    }
    this.saveToLocal();
  }

  updateContent(id: string, content: string) {
    const todo = this.findOne(id);
    if (todo) {
      todo.content = content;
      todo.updatedAt = new Date();
    }
    this.saveToLocal();
  }

  updateState(id: string, process: Process) {
    const todo = this.findOne(id);
    if (todo) {
      todo.process = process;
      todo.updatedAt = new Date();
    }
    this.saveToLocal();
  }
}
