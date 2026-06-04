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
        <Card className="border-green-500/30 shadow-md shadow-green-500/10 bg-green-500/5 overflow-hidden">
            <CardHeader className="bg-green-500/10 border-b border-green-500/20 py-5">
                <CardTitle className="text-xl text-green-700 dark:text-green-400 flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6"/> Replay Comparison
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="grid grid-cols-[1fr_auto_1fr] border-b items-stretch">
                    <div className="p-6 bg-background/50 space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Original Run</span>
                            <div className="scale-110 origin-right">
                                <StatusBadge status={String(original.status)} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1.5 text-base">
                                    <span className="text-muted-foreground text-sm capitalize">{key}:</span>
                                    <span className="font-mono text-destructive bg-destructive/10 px-2 py-1 rounded-md w-fit">{String(origPayload[key] || "Missing")}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1.5 text-base pt-2 border-t border-border/50">
                            <span className="text-muted-foreground text-sm">Result:</span>
                            <span className="text-destructive font-medium">{String(original.failure_reason)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center bg-background border-x border-border/50 px-4 relative">
                        <div className="bg-background rounded-full border shadow-sm p-1.5">
                            <ArrowRight className="h-5 w-5 text-muted-foreground"/>
                        </div>
                    </div>

                    <div className="p-6 bg-background space-y-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-green-600 uppercase tracking-wider">Replay Run</span>
                            <div className="scale-110 origin-right">
                                <StatusBadge status={String(replay.status)} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1.5 text-base">
                                    <span className="text-muted-foreground text-sm capitalize">{key}:</span>
                                    <span className="font-mono text-green-700 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-md w-fit">{String(replayPayload[key])}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1.5 text-base pt-2 border-t border-border/50">
                            <span className="text-muted-foreground text-sm">Result:</span>
                            <span className="text-green-700 dark:text-green-400 font-medium">Completed Successfully</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
