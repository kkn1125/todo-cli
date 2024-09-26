import { Process } from "@module/enum/Process";
export interface ITodo {
    id: string;
    content: string;
    process: Process;
    createdAt: Date;
    updatedAt: Date;
}
