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
            <CardContent className="p-4 sm:p-6 bg-green-500/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                    <Card className="shadow-none border-destructive/20 bg-background/50">
                        <CardHeader className="pb-3 border-b bg-muted/20">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">Original Run</CardTitle>
                                <StatusBadge status={String(original.status)} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground capitalize">{key}:</span>
                                    <span className="font-mono text-destructive font-medium">{String(origPayload[key] || "Missing")}</span>
                                </div>
                            ))}
                            <div className="flex flex-col gap-1 text-sm pt-4 border-t">
                                <span className="text-muted-foreground">Result:</span>
                                <span className="text-destructive font-medium">{String(original.failure_reason)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-background rounded-full border p-1.5 shadow-sm">
                        <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400"/>
                    </div>
                    
                    <Card className="shadow-sm border-green-500/30 bg-background">
                        <CardHeader className="pb-3 border-b bg-green-500/5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-sm text-green-600 dark:text-green-400 uppercase tracking-wider">Replay Run</CardTitle>
                                <StatusBadge status={String(replay.status)} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {correctionKeys.map(key => (
                                <div key={key} className="flex flex-col gap-1 text-sm">
                                    <span className="text-muted-foreground capitalize">{key}:</span>
                                    <span className="font-mono text-green-600 dark:text-green-400 font-medium">{String(replayPayload[key])}</span>
                                </div>
                            ))}
                            <div className="flex flex-col gap-1 text-sm pt-4 border-t border-green-500/20">
                                <span className="text-muted-foreground">Result:</span>
                                <span className="text-green-600 dark:text-green-400 font-bold">Completed</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </CardContent>
        </Card>
    );
}
