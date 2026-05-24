"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { startExecution, replayExecution } from "./actions";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/status-badge";
import { CheckCircle2, AlertTriangle, Play, RefreshCw, Activity } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function PlaygroundContainer() {
    const [workflow, setWorkflow] = useState("Procurement");
    const [payload, setPayload] = useState('{"vendor_id": "v-1"}');

    const [execution, setExecution] = useState<Record<string, unknown> | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const [replay, setReplay] = useState<Record<string, unknown> | null>(null);
    const [isReplaying, setIsReplaying] = useState(false);

    const handleExecute = async () => {
        setIsExecuting(true);
        setExecution(null);
        setReplay(null);
        try {
            const parsedPayload = JSON.parse(payload);
            const result = await startExecution(workflow, parsedPayload);
            setExecution(result);
            if (result.status === "failed") {
                toast.error("Execution Failed");
            } else {
                toast.success("Execution Completed");
            }
        } catch {
            toast.error("Execution failed or Invalid JSON payload");
        } finally {
            setIsExecuting(false);
        }
    }

    const handleReplay = async () => {
        if (!execution?.suggested_correction) return;
        setIsReplaying(true);
        try {
            const result = await replayExecution(execution.id as number, execution.suggested_correction as Record<string, unknown>);
            setReplay(result);
            toast.success("Replay Completed Successfully");
        } catch {
            toast.error("Replay failed");
        } finally {
            setIsReplaying(false);
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Execution Input</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label>Workflow</Label>
                            <Select value={workflow} onValueChange={(val) => {
                                setWorkflow(val || "");
                                if (val === "Procurement") setPayload('{"vendor_id": "v-1"}');
                                if (val === "Logistics") setPayload('{"region": "us-west"}');
                                if (val === "Escalation") setPayload('{"customer_id": "c-99"}');
                            }}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Procurement">Procurement (JSON Format)</SelectItem>
                                    <SelectItem value="Logistics">Logistics (Timeout)</SelectItem>
                                    <SelectItem value="Escalation">Escalation (Missing Data)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Initial Payload (JSON)</Label>
                            <Textarea
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                rows={4}
                                className="font-mono text-sm"
                            />
                        </div>
                        <Button onClick={handleExecute} disabled={isExecuting} className="w-full gap-2 mt-2">
                            {isExecuting ? <RefreshCw className="h-4 w-4 animate-spin"/> : <Play className="h-4 w-4"/>}
                            Execute Workflow
                        </Button>
                    </CardContent>
                </Card>

                {execution && String(execution.status) === "failed" && !replay && (
                    <Card className="border-destructive/20 shadow-sm shadow-destructive/5 bg-destructive/5">
                        <CardHeader>
                            <CardTitle className="text-lg text-destructive flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5"/> Suggested Correction
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-destructive">AgentReplay identified a fix for this failure. You can apply it below to re-run the workflow.</p>
                            <div className="bg-background p-3 rounded border font-mono text-xs">
                                {JSON.stringify(execution.suggested_correction as Record<string, unknown>, null, 2)}
                            </div>
                            <Button onClick={handleReplay} disabled={isReplaying} variant="default" className="w-full gap-2">
                                {isReplaying ? <RefreshCw className="h-4 w-4 animate-spin"/> : <Activity className="h-4 w-4"/>}
                                Apply Fix & Replay
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="flex flex-col gap-6">
                {execution ? (
                    <div className="flex flex-col gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-lg">Execution Timeline</CardTitle>
                                <StatusBadge status={String(execution.status)} />
                            </CardHeader>
                            <CardContent className="flex flex-col gap-4">
                                <div className="space-y-4">
                                    {(execution.events as Record<string, unknown>[])?.map((ev: Record<string, unknown>, idx: number) => (
                                        <div key={idx} className="flex items-start gap-4">
                                            <div className="mt-1">
                                                {String(ev.status) === "completed" ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : String(ev.status) === "failed" ? (
                                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                                ) : (
                                                    <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{String(ev.step_name)}</p>
                                                {(ev.details as Record<string, string>)?.error && (
                                                    <p className="text-xs text-destructive mt-1">{(ev.details as Record<string, string>).error}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {String(execution.status) === "failed" && (
                            <Alert variant="destructive" className="bg-destructive/10">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Diagnostics: {String(execution.failure_reason)}</AlertTitle>
                                <AlertDescription className="text-xs mt-2">
                                   {String(execution.diagnostic_explanation)}
                                </AlertDescription>
                            </Alert>
                        )}

                        {replay && (
                            <Card className="border-green-500/20 shadow-sm shadow-green-500/5 bg-green-500/5">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg text-green-600 dark:text-green-400">Replay Comparison</CardTitle>
                                    <StatusBadge status="success" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2 text-sm text-green-700 dark:text-green-300">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4"/> Failure successfully bypassed.
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4"/> Correction applied to original payload.
                                        </div>
                                    </div>
                                    <div className="bg-background p-3 rounded border font-mono text-xs opacity-80">
                                        Applied: {JSON.stringify(replay.correction_applied)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border rounded-lg bg-muted/20 text-muted-foreground text-sm p-8 text-center min-h-[300px]">
                        Submit an execution from the panel to view the timeline and diagnostics.
                    </div>
                )}
            </div>
        </div>
    )
}
