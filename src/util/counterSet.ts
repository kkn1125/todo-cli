import { GlobalState } from "@common/variables";
import { TodoCounter } from "@module/types/TodoCounter";

export function counterSet(key: keyof TodoCounter, value: number) {
  GlobalState.Counter[key] = value;
}
