import { RunDetail } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import Link from "next/link";
import { ArrowLeftRight, Check } from "lucide-react";

export function ComparisonView({ current, original }: { current: RunDetail, original: RunDetail }) {

    const latencyDiff = (current.latency_ms || 0) - (original.latency_ms || 0);
    const tokensDiff = (current.tokens_used || 0) - (original.tokens_used || 0);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border">
                <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Comparing <Link href={`/runs/${current.id}`} className="hover:underline text-primary">#{current.id}</Link> against original <Link href={`/runs/${original.id}`} className="hover:underline text-primary">#{original.id}</Link>
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ORIGINAL */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Original Run #{original.id}</h3>

                    <Card>
                        <CardHeader className="py-3 bg-muted/30 border-b">
                            <CardTitle className="text-sm flex justify-between items-center">
                                Status <StatusBadge status={original.status} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Latency</span>
                                <span>{original.latency_ms ? `${original.latency_ms}ms` : "-"}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tokens</span>
                                <span>{original.tokens_used || "-"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3 bg-muted/30 border-b">
                            <CardTitle className="text-sm">Response</CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap font-mono border overflow-x-auto">
                                {original.response || <span className="text-muted-foreground italic">No response</span>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CURRENT (REPLAY) */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2">
                        Replay Run #{current.id}
                        {current.status === "success" && original.status === "failed" && <Badge variant="default" className="bg-green-600 text-white border-green-600"><Check className="h-3 w-3 mr-1"/> Fixed</Badge>}
                    </h3>

                    <Card className="border-primary/20 shadow-sm shadow-primary/5">
                        <CardHeader className="py-3 bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-sm flex justify-between items-center">
                                Status <StatusBadge status={current.status} />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-4 flex flex-col gap-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Latency</span>
                                <div className="flex items-center gap-2">
                                    <span>{current.latency_ms ? `${current.latency_ms}ms` : "-"}</span>
                                    {latencyDiff !== 0 && (
                                        <Badge variant={latencyDiff < 0 ? "secondary" : "destructive"} className="text-[10px] px-1.5 py-0">
                                            {latencyDiff > 0 ? "+" : ""}{latencyDiff}ms
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tokens</span>
                                <div className="flex items-center gap-2">
                                    <span>{current.tokens_used || "-"}</span>
                                    {tokensDiff !== 0 && (
                                        <Badge variant={tokensDiff < 0 ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0 text-muted-foreground">
                                            {tokensDiff > 0 ? "+" : ""}{tokensDiff}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 shadow-sm shadow-primary/5">
                        <CardHeader className="py-3 bg-primary/5 border-b border-primary/10">
                            <CardTitle className="text-sm">Response</CardTitle>
                        </CardHeader>
                        <CardContent className="py-4">
                            <div className="bg-muted p-4 rounded-md text-xs whitespace-pre-wrap font-mono border overflow-x-auto">
                                {current.response || <span className="text-muted-foreground italic">No response</span>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
