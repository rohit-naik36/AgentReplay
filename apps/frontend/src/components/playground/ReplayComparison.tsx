import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface ReplayComparisonProps {
    original: Record<string, unknown>;
    replay: Record<string, unknown>;
}

export function ReplayComparison({ original, replay }: ReplayComparisonProps) {
    const origPayload = original.input_payload as Record<string, unknown>;
    const replayPayload = replay.input_payload as Record<string, unknown>;
    const correctionKeys = Object.keys(original.suggested_correction || {});

    return (
        <Card className="border-border shadow-sm overflow-hidden flex flex-col h-full">
            <CardHeader className="bg-muted/30 border-b pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500"/> Replay Comparison
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center flex-1">
                    <div className="bg-background border rounded-lg p-5 space-y-5 shadow-sm self-stretch flex flex-col">
                        <div className="flex justify-between items-center border-b pb-3">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original Run</span>
                            <StatusBadge status={String(original.status)} />
                        </div>
                        <div className="flex-1 space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground capitalize font-medium">{key}</span>
                                    <span className="font-mono text-destructive bg-destructive/10 px-2 py-1 rounded w-fit">{String(origPayload[key] || "Missing")}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 text-sm pt-3 border-t mt-auto">
                            <span className="text-muted-foreground">Result:</span>
                            <span className="text-destructive font-medium">{String(original.failure_reason)}</span>
                        </div>
                    </div>

                    <div className="hidden md:flex justify-center items-center">
                        <div className="bg-muted rounded-full p-2">
                            <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                    </div>

                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5 space-y-5 shadow-sm self-stretch flex flex-col">
                        <div className="flex justify-between items-center border-b border-green-500/20 pb-3">
                            <span className="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wider">Replay Run</span>
                            <StatusBadge status={String(replay.status)} />
                        </div>
                        <div className="flex-1 space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground capitalize font-medium">{key}</span>
                                    <span className="font-mono text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded w-fit">{String(replayPayload[key])}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1 text-sm pt-3 border-t border-green-500/20 mt-auto">
                            <span className="text-muted-foreground">Result:</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">Completed</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
