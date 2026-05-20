import { PaginatedRuns, RunDetail } from "@/lib/types";

// In Docker via docker-compose, this will be server-side accessible via http://backend:8000
// Note that Next.js Server Components run server-side
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend:8000/api";

export async function getRuns({
  page = 1,
  size = 10,
  search = "",
  status = "",
}: {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
} = {}): Promise<PaginatedRuns> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  if (search) params.append("search", search);
  if (status && status !== "all") params.append("status", status);

  const res = await fetch(`${API_URL}/runs?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch runs: ${res.status} ${errorText}`);
  }
  return res.json();
}

export async function getRun(id: string): Promise<RunDetail> {
  const res = await fetch(`${API_URL}/runs/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch run");
  return res.json();
}

export async function replayRun(id: string): Promise<RunDetail> {
  const res = await fetch(`${API_URL}/runs/${id}/replay`, {
    method: "POST",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to replay run");
  return res.json();
}
