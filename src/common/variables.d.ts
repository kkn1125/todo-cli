import { TodoCounter } from "@module/types/TodoCounter";
import { TodoManagerState } from "@module/types/TodoManagerState";
export declare const DATABASE_DIR: string;
export declare const DATABASE_NAME = "todo_list.json";
export declare const DATABASE_UPDATE_MESSAGE = "\uD83D\uDDC2\uFE0F db update(automation): commit for todo_list update";
export declare const INPUT_NEXT_LINE = "\n> ";
export declare const PER_PAGE = 9;
export declare const GlobalState: {
    TodoManagerState: TodoManagerState;
    Counter: TodoCounter;
};
