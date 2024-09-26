import { ChildProcessWithoutNullStreams } from "child_process";
export declare function customSpawn(command: string, ...args: string[]): Promise<ChildProcessWithoutNullStreams>;
