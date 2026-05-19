export type ToolCall = {
  id: number;
  run_id: number;
  tool_name: string;
  input_json: Record<string, unknown> | null;
  output_json: Record<string, unknown> | null;
  status: string;
  created_at: string;
};

export type Run = {
  id: number;
  session_id: string | null;
  parent_run_id: number | null;
  prompt: string;
  response: string | null;
  model: string | null;
  latency_ms: number | null;
  tokens_used: number | null;
  status: string;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
};

export type RunDetail = Run & {
  tool_calls: ToolCall[];
};

export type PaginatedRuns = {
  items: Run[];
  total: number;
  page: number;
  size: number;
  pages: number;
};
