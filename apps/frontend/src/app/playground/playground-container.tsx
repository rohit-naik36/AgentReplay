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
import { SuggestedCorrection } from "@/components/playground/SuggestedCorrection";
import { ReplayComparison } from "@/components/playground/ReplayComparison";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PlaygroundContainer() {
    const [mode, setMode] = useState<"natural" | "json">("natural");
    const [naturalInput, setNaturalInput] = useState("Need 500 units of sku123 delivered next week");
    const [workflow, setWorkflow] = useState("Procurement");
    const [payload, setPayload] = useState('{"vendor_id": "v-1"}');

    const [execution, setExecution] = useState<Record<string, unknown> | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    const [replay, setReplay] = useState<Record<string, unknown> | null>(null);
    const [isReplaying, setIsReplaying] = useState(false);

    const parseNaturalLanguage = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes("track") || lower.includes("shipment") || lower.includes("logistics")) {
            const match = text.match(/TRK-\d+/i);
            return {
                workflow: "Logistics",
                payload: { workflow: "logistics", tracking_id: match ? match[0].toUpperCase() : "TRK-0000" }
            };
        } else if (lower.includes("escalate") || lower.includes("refund") || lower.includes("case")) {
            const match = text.match(/REF-\d+/i);
            return {
                workflow: "Escalation",
                payload: { workflow: "escalation", case_id: match ? match[0].toUpperCase() : "REF-0000" }
            };
        } else {
            // Default to Procurement
            const skuMatch = text.match(/sku\d+/i);
            const qtyMatch = text.match(/\d+/);
            return {
                workflow: "Procurement",
                payload: {
                    workflow: "procurement",
                    sku: skuMatch ? skuMatch[0].toLowerCase() : "sku-unknown",
                    quantity: qtyMatch ? parseInt(qtyMatch[0]) : 1,
                    delivery: "next week",
                    vendor_id: "v-1" // Include vendor_id to trigger failure
                }
            };
        }
    };

    const handleExecute = async () => {
        setIsExecuting(true);
        setExecution(null);
        setReplay(null);
        try {
            let activeWorkflow = workflow;
            let activePayload: Record<string, unknown>;

            if (mode === "natural") {
                const parsed = parseNaturalLanguage(naturalInput);
                activeWorkflow = parsed.workflow;
                activePayload = parsed.payload;
            } else {
                activePayload = JSON.parse(payload);
            }

            const result = await startExecution(activeWorkflow, activePayload);
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


    const parsedPreview = mode === "natural" ? parseNaturalLanguage(naturalInput) : { workflow, payload: {} };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
            <Card className="border-border shadow-sm">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] divide-y lg:divide-y-0 lg:divide-x">
                        <div className="p-6 space-y-6">
                            <Tabs value={mode} onValueChange={(val) => setMode(val as "natural" | "json")} className="w-full">
                                <TabsList className="grid grid-cols-2 mb-6 max-w-[400px]">
                                    <TabsTrigger value="natural">Natural Language</TabsTrigger>
                                    <TabsTrigger value="json">Raw JSON</TabsTrigger>
                                </TabsList>
                                <TabsContent value="natural" className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground uppercase text-xs tracking-wider">Describe your request</Label>
                                        <Textarea
                                            value={naturalInput}
                                            onChange={(e) => setNaturalInput(e.target.value)}
                                            placeholder="e.g. Need 500 units of sku123 delivered next week"
                                            className="min-h-[220px] text-base resize-none p-4"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-muted-foreground uppercase text-xs tracking-wider">Examples</Label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div onClick={() => setNaturalInput("Need 500 units of sku123 delivered next week")} className="cursor-pointer border rounded-md p-3 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors flex flex-col gap-1">
                                                <span className="font-semibold text-foreground">Procurement</span>
                                                <span>Need 500 units of sku123</span>
                                            </div>
                                            <div onClick={() => setNaturalInput("Track shipment TRK-1002")} className="cursor-pointer border rounded-md p-3 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors flex flex-col gap-1">
                                                <span className="font-semibold text-foreground">Logistics</span>
                                                <span>Track shipment TRK-1002</span>
                                            </div>
                                            <div onClick={() => setNaturalInput("Escalate refund case REF-2004")} className="cursor-pointer border rounded-md p-3 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors flex flex-col gap-1">
                                                <span className="font-semibold text-foreground">Escalation</span>
                                                <span>Customer refund not processed</span>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="json" className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground uppercase text-xs tracking-wider">Target Workflow</Label>
                                        <Select value={workflow} onValueChange={(val) => {
                                            setWorkflow(val || "");
                                            if (val === "Procurement") setPayload('{"vendor_id": "v-1"}');
                                            if (val === "Logistics") setPayload('{"region": "us-west"}');
                                            if (val === "Escalation") setPayload('{"customer_id": "c-99"}');
                                        }}>
                                            <SelectTrigger><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Procurement">Procurement</SelectItem>
                                                <SelectItem value="Logistics">Logistics</SelectItem>
                                                <SelectItem value="Escalation">Escalation</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground uppercase text-xs tracking-wider">Raw JSON Payload</Label>
                                        <Textarea
                                            value={payload}
                                            onChange={(e) => setPayload(e.target.value)}
                                            className="font-mono text-sm min-h-[220px] p-4"
                                        />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                        <div className="p-6 bg-muted/10 space-y-6 flex flex-col">
                            <div className="space-y-2">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider">Detected Workflow</Label>
                                <div className="border bg-background rounded-md p-3 text-sm font-medium flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-primary" />
                                    {mode === "natural" ? parsedPreview.workflow : workflow}
                                </div>
                            </div>
                            <div className="space-y-2 flex-1 flex flex-col">
                                <Label className="text-muted-foreground uppercase text-xs tracking-wider">Payload Preview</Label>
                                <div className="border bg-background rounded-md p-4 text-xs font-mono whitespace-pre-wrap flex-1 overflow-auto text-muted-foreground">
                                    {mode === "natural" ? JSON.stringify(parsedPreview.payload, null, 2) : payload}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-muted/30">
                        <Button onClick={handleExecute} disabled={isExecuting} size="lg" className="w-full gap-2 text-base font-semibold">
                            {isExecuting ? <RefreshCw className="h-5 w-5 animate-spin"/> : <Play className="h-5 w-5"/>}
                            Execute Workflow
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
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

                            {String(execution.status) === "failed" && (
                                <div className="border-t bg-destructive/5 p-4 rounded-b-lg">
                                    <Alert variant="destructive" className="bg-destructive/10 border-0 shadow-none -m-4 rounded-t-none">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Diagnostics: {String(execution.failure_reason)}</AlertTitle>
                                        <AlertDescription className="text-xs mt-2">
                                           {String(execution.diagnostic_explanation)}
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full border rounded-lg bg-muted/20 text-muted-foreground text-sm p-8 text-center min-h-[300px]">
                        Submit an execution from the panel to view the timeline and diagnostics.
                    </div>
                )}
                </div>

                <div className="flex flex-col gap-6">
                    {execution && String(execution.status) === "failed" && !replay && (
                        <SuggestedCorrection
                            execution={execution}
                            onReplay={handleReplay}
                            isReplaying={isReplaying}
                        />
                    )}
                    {replay && (
                        <ReplayComparison original={execution as Record<string, unknown>} replay={replay} />
                    )}
                </div>
            </div>
        </div>
    )
}
