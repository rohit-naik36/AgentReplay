import { RunDetail } from "@/lib/types";
import { AlertTriangle, AlertCircle, DatabaseZap } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export function RCAPanel({ run }: { run: RunDetail }) {
  if (run.status !== "failed") return null;

  let title = "Execution Failed";
  let description = "The run failed to execute completely.";
  let Icon = AlertCircle;

  if (run.timeout_reason || run.error_type === "TimeoutError") {
    title = "Timeout Detected";
    description = run.timeout_reason || "The run likely encountered a timeout or a long-running tool execution.";
    Icon = AlertTriangle;
  } else if (run.malformed_output) {
    title = "Malformed Output Detected";
    description = "Model output may not conform to the expected schema (e.g. invalid JSON).";
    Icon = DatabaseZap;
  } else if (run.token_limit_hit) {
    title = "Context Overflow Detected";
    description = "The execution exceeded the allowed token context window.";
    Icon = AlertCircle;
  } else if (run.error_message) {
    title = run.error_type || "Execution Error";
    description = run.error_message;
  }

  return (
    <Alert variant="destructive" className="bg-destructive/10">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="text-xs mt-2">
         {description}
      </AlertDescription>
    </Alert>
  );
}
