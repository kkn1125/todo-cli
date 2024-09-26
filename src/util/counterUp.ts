import { GlobalState } from "@common/variables";
import { TodoCounter } from "@module/types/TodoCounter";

export function counterUp(key: keyof TodoCounter) {
  GlobalState.Counter.New += 1;
}
