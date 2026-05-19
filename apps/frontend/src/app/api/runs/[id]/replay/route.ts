export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const API_URL = process.env.API_URL || "http://127.0.0.1:8000/api";
  try {
      const res = await fetch(`${API_URL}/runs/${params.id}/replay`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
      });

      if (!res.ok) {
          throw new Error("Failed to replay run")
      }

      const data = await res.json();
      return Response.json(data);
  } catch (error) {
      console.error(error);
      return Response.json({ error: "Failed to replay" }, { status: 500 });
  }
}
