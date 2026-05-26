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
        <Card className="border-green-500/20 shadow-sm shadow-green-500/5 bg-green-500/5 overflow-hidden">
            <CardHeader className="bg-green-500/10 border-b border-green-500/20 pb-3">
                <CardTitle className="text-lg text-green-700 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5"/> Detected Improvements
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-2 divide-x border-b">
                    <div className="p-4 bg-background/50 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Original Run</span>
                            <StatusBadge status={String(original.status)} />
                        </div>
                        {correctionKeys.map(key => (
                            <div key={key} className="flex flex-col gap-1 text-sm">
                                <span className="text-muted-foreground capitalize">{key}:</span>
                                <span className="font-mono text-destructive">{String(origPayload[key] || "Missing")}</span>
                            </div>
                        ))}
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-muted-foreground">Result:</span>
                            <span className="text-destructive font-medium">{String(original.failure_reason)}</span>
                        </div>
                    </div>

                    <div className="p-4 bg-background space-y-4 relative">
                        <div className="absolute top-1/2 -left-3 -translate-y-1/2 bg-background rounded-full border p-0.5 shadow-sm">
                            <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">Replay Run</span>
                            <StatusBadge status={String(replay.status)} />
                        </div>
                        {correctionKeys.map(key => (
                            <div key={key} className="flex flex-col gap-1 text-sm">
                                <span className="text-muted-foreground capitalize">{key}:</span>
                                <span className="font-mono text-green-600 dark:text-green-400">{String(replayPayload[key])}</span>
                            </div>
                        ))}
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="text-muted-foreground">Result:</span>
                            <span className="text-green-600 dark:text-green-400 font-medium">Completed</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
