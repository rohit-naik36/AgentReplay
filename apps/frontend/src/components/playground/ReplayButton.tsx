import { Button } from "@/components/ui/button";
import { RefreshCw, Play } from "lucide-react";

interface ReplayButtonProps {
    onClick: () => void;
    isPending: boolean;
}

export function ReplayButton({ onClick, isPending }: ReplayButtonProps) {
    return (
        <Button onClick={onClick} disabled={isPending} variant="default" className="w-full gap-2">
            {isPending ? <RefreshCw className="h-4 w-4 animate-spin"/> : <Play className="h-4 w-4"/>}
            Replay with Suggested Fix
        </Button>
    );
}
