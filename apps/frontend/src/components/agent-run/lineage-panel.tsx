import { RunDetail } from "@/lib/types";
import { format } from "date-fns";
import { GitCommit, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export async function LineagePanel({ runId }: { runId: number }) {
  const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";
  let lineage;
  try {
      const res = await fetch(`${API_URL}/runs/${runId}/lineage`, { cache: "no-store" });
      if (res.ok) lineage = await res.json();
  } catch {
      // Ignored
  }

  if (!lineage || lineage.chain.length <= 1) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-muted-foreground" />
            Replay Lineage
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 text-sm pl-4 relative">
         <div className="absolute left-[27px] top-4 bottom-4 w-px bg-border -z-10" />

         {lineage.chain.map((chainRun: RunDetail, index: number) => {
             const isCurrent = chainRun.id === runId;
             const isOriginal = index === 0;
             return (
                 <div key={chainRun.id} className={`flex items-start gap-4 py-2 ${isCurrent ? "font-medium" : "text-muted-foreground"}`}>
                    <div className="bg-background mt-0.5">
                        <GitCommit className={`h-5 w-5 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between w-full">
                            <Link href={`/runs/${chainRun.id}`} className="hover:underline flex items-center gap-2">
                                #{chainRun.id}
                                {isOriginal && <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-semibold">Original</span>}
                            </Link>
                            <StatusBadge status={chainRun.status} />
                        </div>
                        <span className="text-xs">{format(new Date(chainRun.created_at), "MMM d, HH:mm")}</span>
                    </div>
                 </div>
             )
         })}
      </CardContent>
    </Card>
  );
}
