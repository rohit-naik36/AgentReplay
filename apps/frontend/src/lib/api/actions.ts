"use server";

import { replayRun as serverReplayRun } from "@/lib/api";

export async function replayRun(id: string) {
    try {
        const replayedRun = await serverReplayRun(id);
        return replayedRun as unknown as Record<string, unknown>;
    } catch (e: unknown) {
        if (e instanceof Error) {
            return { error: e.message };
        }
        return { error: "Failed to replay" };
    }
}
