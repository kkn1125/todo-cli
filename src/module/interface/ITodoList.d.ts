import { ITodo } from "./ITodo";
export interface ITodoList {
    email?: string;
    author?: string;
    list: ITodo[];
    createdAt: Date;
}
