import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  let bgColor = "bg-muted text-muted-foreground border-transparent";
  if (status === "success")
    bgColor =
      "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
  if (status === "failed")
    bgColor = "bg-destructive/10 text-destructive border-destructive/20";
  if (status === "replayed")
    bgColor =
      "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";

  return (
    <span
      className={cn(
        "px-2 py-0.5 rounded-full text-xs font-semibold capitalize border inline-flex items-center",
        bgColor,
        className,
      )}
    >
      {status}
    </span>
  );
}
