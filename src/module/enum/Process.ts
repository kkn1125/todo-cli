export const Process = {
  Init: "init",
  Doing: "doing",
  Done: "done",
} as const;
export type Process = (typeof Process)[keyof typeof Process];
export const ProcessIcon = {
  Init: "✨",
  Doing: "📄",
  Done: "✔️",
} as const;
export type ProcessIcon = (typeof ProcessIcon)[keyof typeof ProcessIcon];
