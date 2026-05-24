"use server";

export async function startExecution(workflowName: string, inputPayload: Record<string, unknown>) {
    const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";
    const res = await fetch(`${API_URL}/executions/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow_name: workflowName, input_payload: inputPayload })
    });
    if (!res.ok) throw new Error("Failed to start execution");
    return res.json();
}

export async function replayExecution(executionId: number, correction: Record<string, unknown>) {
    const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";
    const res = await fetch(`${API_URL}/executions/${executionId}/replay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correction })
    });
    if (!res.ok) throw new Error("Failed to replay execution");
    return res.json();
}
