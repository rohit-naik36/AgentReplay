import Link from "next/link";
import { format } from "date-fns";
import { getRuns } from "@/lib/api";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/agent-run/search-input";
import { redirect } from "next/navigation";

export default async function DashboardPage(props: {
  searchParams?: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const status = searchParams?.status || "all";
  const page = Number(searchParams?.page) || 1;

  const runs = await getRuns({ search, status, page });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Agent Runs</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end bg-muted/50 p-4 rounded-lg border">
        <div className="flex flex-col gap-2 w-full sm:w-1/3">
          <Label htmlFor="search">Search</Label>
          <SearchInput initialValue={search} />
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-1/4">
           <Label>Status</Label>
           <form action={async (formData: FormData) => {
              "use server";
              const newStatus = formData.get("status")?.toString() || "all";
              const params = new URLSearchParams();
              if (search) params.set("search", search);
              if (newStatus && newStatus !== "all") params.set("status", newStatus);
              redirect(`/?${params.toString()}`);
           }} className="flex gap-2">
              <Select name="status" defaultValue={status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="replayed">Replayed</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">Filter</Button>
           </form>
        </div>
      </div>

      <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Run ID</TableHead>
              <TableHead className="max-w-[300px]">Prompt Extract</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No runs found. Try adjusting your filters or send some data!
                </TableCell>
              </TableRow>
            ) : (
              runs.items.map((run) => (
                <TableRow key={run.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <Link href={`/runs/${run.id}`} className="block w-full h-full">#{run.id}</Link>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                     <Link href={`/runs/${run.id}`} className="block w-full h-full">{run.prompt}</Link>
                  </TableCell>
                  <TableCell>{run.model || "-"}</TableCell>
                  <TableCell>{run.latency_ms ? `${run.latency_ms}ms` : "-"}</TableCell>
                  <TableCell>{run.tokens_used || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge status={run.status} />
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {format(new Date(run.created_at), "MMM d, HH:mm:ss")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {runs.pages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
            {page > 1 && (
                <Link href={`/?page=${page - 1}&search=${search}&status=${status}`}>
                    <Button variant="outline">Previous</Button>
                </Link>
            )}
            <span className="flex items-center text-sm px-4">Page {page} of {runs.pages}</span>
            {page < runs.pages && (
                <Link href={`/?page=${page + 1}&search=${search}&status=${status}`}>
                    <Button variant="outline">Next</Button>
                </Link>
            )}
        </div>
      )}
    </div>
  );
}
