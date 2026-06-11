"use client";

import { Play, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ReplayButton({ runId, replayAction }: { runId: number, replayAction: (id: string) => Promise<Record<string, unknown>> }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleReplay = () => {
    startTransition(async () => {
      try {
        const replayedRun = await replayAction(runId.toString());
        if (replayedRun.error) {
            toast.error("Failed to replay run: " + String(replayedRun.error));
        } else {
            toast.success(`Successfully replayed Run #${runId}`);
            router.push(`/runs/${replayedRun.id}?compare=${runId}`);
        }
      } catch {
        toast.error("An error occurred while replaying.");
      }
    });
  };

  return (
    <Button variant="default" className="gap-2" onClick={handleReplay} disabled={isPending}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
      {isPending ? "Replaying..." : "Replay Run"}
    </Button>
  );
}
