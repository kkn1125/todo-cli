export const Process = {
  Init: "init",
  Doing: "doing",
  Done: "done",
} as const;
export type Process = (typeof Process)[keyof typeof Process];
