import { Process } from "./enum/Process";
import { ITodo } from "./interface/ITodo";
export default class Todo implements ITodo {
    id: string;
    content: string;
    process: Process;
    createdAt: Date;
    updatedAt: Date;
    constructor(content: string);
    init(): void;
    doing(): void;
    done(): void;
}
