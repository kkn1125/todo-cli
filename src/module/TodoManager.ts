import { DATABASE_DIR, DATABASE_NAME, GlobalState } from "@common/variables";
import { checkDatabase } from "@src/util/checkDatabase";
import { counterDown } from "@src/util/counterDown";
import { counterUp } from "@src/util/counterUp";
import { createDir } from "@src/util/createDir";
import { isInstalled } from "@src/util/isInstalled";
import { loadFile } from "@src/util/loadFIle";
import { pullRemoteDatabase } from "@src/util/pullRemoteDatabase";
import { updateFile } from "@src/util/updateFile";
import { updateRemoteRepository } from "@src/util/updateRemoteRepository";
import Todo from "./Todo";
import { Process } from "./enum/Process";
import { ITodoList } from "./interface/ITodoList";
import { TodoCounter } from "./types/TodoCounter";
import { select } from "@inquirer/prompts";

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
    createDir(DATABASE_DIR);
    updateFile(DATABASE_DIR, DATABASE_NAME, this.data);
    this.pullRemoteDatabase();
    const data = loadFile(DATABASE_DIR, DATABASE_NAME);
    this.data = data;
  }

  reload() {
    this.load();
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

  deleteAllFrom(ids: string[]) {
    for (const id of ids) {
      this.deleteById(id);
    }
  }

  pullRemoteDatabase() {
    pullRemoteDatabase();
  }

  isInstallGithubCli() {
    return isInstalled("gh");
  }

  async installGithubCli(): Promise<string | null> {
    const installable: string[] = [];
    const isInstallChoco = isInstalled("choco");
    // const isInstallWinget = isInstalled("winget");
    isInstallChoco && installable.push("choco");
    // isInstallWinget && installable.push("winget");
    if (installable.length > 0) {
      const selected: string = await select({
        message: "아래 감지된 도구를 선택해 Github CLI를 설치합니다.",
        choices: [...installable],
      });
      return selected;
    } else {
      return null;
    }
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
