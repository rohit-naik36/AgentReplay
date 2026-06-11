import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { ReplayButton } from "./ReplayButton";

interface SuggestedCorrectionProps {
    execution: Record<string, unknown>;
    onReplay: () => void;
    isReplaying: boolean;
}

export function SuggestedCorrection({ execution, onReplay, isReplaying }: SuggestedCorrectionProps) {
    if (execution.status !== "failed" || !execution.suggested_correction) {
        return null;
    }

    const payload = execution.input_payload as Record<string, unknown>;
    const correction = execution.suggested_correction as Record<string, unknown>;

    // Attempt to extract the diffs
    const diffs: { key: string; original: unknown; suggested: unknown }[] = [];
    for (const key in correction) {
        if (payload[key] !== correction[key]) {
            diffs.push({ key, original: payload[key], suggested: correction[key] });
        }
    }

    return (
        <Card className="border-destructive/20 shadow-sm shadow-destructive/5 bg-destructive/5">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5"/> Suggested Correction
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-background/80 rounded-md border p-4 text-sm space-y-4">
                    {diffs.map((diff, i) => (
                        <div key={i} className="flex flex-col gap-1">
                            <span className="font-semibold text-muted-foreground capitalize">{diff.key}:</span>
                            <div className="flex items-center gap-2 font-mono">
                                <span className="line-through opacity-70 text-destructive">{String(diff.original || "Missing")}</span>
                                <span>→</span>
                                <span className="text-green-600 dark:text-green-400">{String(diff.suggested)}</span>
                            </div>
                        </div>
                    ))}
                    <div className="flex flex-col gap-1 pt-2 border-t">
                        <span className="font-semibold text-muted-foreground">Reason:</span>
                        <span>{String(execution.diagnostic_explanation)}</span>
                    </div>
                </div>
                <ReplayButton onClick={onReplay} isPending={isReplaying} />
            </CardContent>
        </Card>
    );
}
