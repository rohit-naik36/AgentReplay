import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Clock, Box, Hash, GitBranch } from "lucide-react";

import { getRun } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import { CopyButton } from "@/components/ui/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RCAPanel } from "@/components/agent-run/rca-panel";
import { LineagePanel } from "@/components/agent-run/lineage-panel";
import { ComparisonView } from "@/components/agent-run/comparison-view";
import { ReplayButton } from "@/components/agent-run/replay-button";
import { replayRun } from "@/lib/api/actions"; // We will extract the action

export default async function RunDetailsPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ compare?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const compareId = searchParams.compare;
  let run;
  try {
    run = await getRun(params.id);
  } catch {
    notFound();
  }

  let originalRunToCompare;
  if (compareId) {
      try {
          originalRunToCompare = await getRun(compareId);
      } catch {
          // Ignore invalid compare IDs
      }
  }

  if (originalRunToCompare) {
      return (
          <div className="flex flex-col gap-6 w-full pb-20">
              <div className="flex items-center gap-4">
                  <Link href={`/runs/${run.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Exit Comparison
                    </Button>
                  </Link>
              </div>
              <ComparisonView current={run} original={originalRunToCompare} />
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-3">
            Run #{run.id}
            <StatusBadge status={run.status} />
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(new Date(run.created_at), "PPpp")}
            {run.session_id && <span className="ml-2">| Session: {run.session_id}</span>}
          </p>
        </div>
        <ReplayButton runId={run.id} replayAction={replayRun} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Timeline Sidebar */}
        <div className="md:col-span-1 flex flex-col gap-4">
           <RCAPanel run={run} />
           <LineagePanel runId={run.id} />
           <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Execution Summary</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                 <div className="flex items-center gap-2">
                    <Box className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Model</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{run.model || "Unknown"}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Latency</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{run.latency_ms ? `${run.latency_ms}ms` : "-"}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1">Tokens</span>
                    <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{run.tokens_used || "-"}</span>
                 </div>
                 {run.parent_run_id && (
                     <div className="flex items-center gap-2 mt-2 pt-4 border-t">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-muted-foreground">Replay of</span>
                        <Link href={`/runs/${run.parent_run_id}`} className="font-mono text-primary hover:underline">#{run.parent_run_id}</Link>
                     </div>
                 )}
              </CardContent>
           </Card>

           {run.metadata_json && (
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Metadata</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border p-2 bg-muted/50">
                        <pre className="text-xs font-mono text-muted-foreground">
                            {JSON.stringify(run.metadata_json, null, 2)}
                        </pre>
                    </ScrollArea>
                </CardContent>
            </Card>
           )}
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 flex flex-col gap-6">

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Prompt</CardTitle>
              <CopyButton value={run.prompt} />
            </CardHeader>
            <CardContent>
               <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap font-mono border">
                 {run.prompt}
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">Response</CardTitle>
              {run.response && <CopyButton value={run.response} />}
            </CardHeader>
            <CardContent>
               {run.response ? (
                  <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap font-mono border">
                    {run.response}
                  </div>
               ) : (
                  <div className="text-sm text-muted-foreground italic bg-muted/30 p-4 rounded-md border border-dashed">
                    No response recorded.
                  </div>
               )}
            </CardContent>
          </Card>

          {run.tool_calls && run.tool_calls.length > 0 && (
              <div className="flex flex-col gap-3">
                  <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
                      Tool Calls <Badge variant="secondary" className="rounded-full">{run.tool_calls.length}</Badge>
                  </h3>
                  <Accordion className="w-full flex flex-col gap-3">
                    {run.tool_calls.map((tc, idx) => (
                      <AccordionItem key={tc.id} value={`tc-${tc.id}`} className="border rounded-lg bg-card px-4 py-1">
                        <AccordionTrigger className="hover:no-underline py-3">
                           <div className="flex items-center gap-3 w-full pr-4">
                              <Badge variant="outline" className="font-mono text-xs">{idx + 1}</Badge>
                              <span className="font-semibold text-sm font-mono">{tc.tool_name}</span>
                              <div className="ml-auto flex items-center gap-2">
                                  <StatusBadge status={tc.status} />
                                  <span className="text-xs text-muted-foreground font-normal">
                                      {format(new Date(tc.created_at), "HH:mm:ss.SSS")}
                                  </span>
                              </div>
                           </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 pb-4 flex flex-col gap-4">
                            {tc.input_json && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Input</span>
                                        <CopyButton value={JSON.stringify(tc.input_json, null, 2)} className="h-6 w-6" />
                                    </div>
                                    <div className="bg-muted p-3 rounded-md border overflow-x-auto">
                                        <pre className="text-xs font-mono">{JSON.stringify(tc.input_json, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                            {tc.output_json && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Output</span>
                                        <CopyButton value={JSON.stringify(tc.output_json, null, 2)} className="h-6 w-6" />
                                    </div>
                                    <div className="bg-muted p-3 rounded-md border overflow-x-auto">
                                        <pre className="text-xs font-mono">{JSON.stringify(tc.output_json, null, 2)}</pre>
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
              </div>
          )}

        </div>
      </div>
    </div>
  );
}
