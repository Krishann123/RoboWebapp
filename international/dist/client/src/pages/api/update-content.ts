import type { APIRoute } from "astro";
import { updateContent } from "@/components/db"; // adjust path based on your structure
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { location, description } = body;
  
  if (!location || !description) {
      return new Response(
        JSON.stringify({ error: "Location and description are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  try {
    await updateContent(location, description);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Update failed", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
