import Todo from "./Todo";
import { Process } from "./enum/Process";
import { ITodoList } from "./interface/ITodoList";
import { TodoCounter } from "./types/TodoCounter";
export default class TodoManager {
    data: ITodoList;
    constructor();
    private load;
    private checkDatabase;
    private init;
    reload(): void;
    add(content: string): void;
    deleteById(id: string): void;
    deleteAllFrom(ids: string[]): void;
    pullRemoteDatabase(): void;
    isInstallGithubCli(): boolean;
    installGithubCli(): Promise<string | null>;
    saveToLocal(): void;
    saveToRepository(): Promise<void>;
    counterUp(key: keyof TodoCounter): void;
    counterDown(key: keyof TodoCounter): void;
    findAll(): import("./interface/ITodo").ITodo[];
    findOne(id: string): import("./interface/ITodo").ITodo | undefined;
    update(id: string, data: Todo): void;
    updateContent(id: string, content: string): void;
    updateState(id: string, process: Process): void;
}
