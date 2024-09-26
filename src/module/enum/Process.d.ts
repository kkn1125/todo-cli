export declare const Process: {
    readonly Init: "init";
    readonly Doing: "doing";
    readonly Done: "done";
};
export type Process = (typeof Process)[keyof typeof Process];
export declare const ProcessIcon: {
    readonly Init: "✨";
    readonly Doing: "📄";
    readonly Done: "✔️";
};
export type ProcessIcon = (typeof ProcessIcon)[keyof typeof ProcessIcon];
