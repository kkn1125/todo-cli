import { Process } from "./enum/Process";
import { ITodo } from "./interface/ITodo";
import { v4 } from "uuid";

export default class Todo implements ITodo {
  id: string;
  content: string;
  process: Process;
  createdAt: Date;
  updatedAt: Date;

  constructor(content: string) {
    this.id = v4();
    this.content = content;
    this.process = Process.Init;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  init() {
    this.process = Process.Init;
  }

  doing() {
    this.process = Process.Doing;
  }

  done() {
    this.process = Process.Done;
  }
}
