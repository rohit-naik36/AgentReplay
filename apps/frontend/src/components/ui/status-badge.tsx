import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: string, className?: string }) {
  let bgColor = "bg-gray-100 text-gray-800";
  if (status === "success") bgColor = "bg-green-100 text-green-800";
  if (status === "failed") bgColor = "bg-red-100 text-red-800";
  if (status === "replayed") bgColor = "bg-purple-100 text-purple-800";

  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium capitalize", bgColor, className)}>
      {status}
    </span>
  );
}
