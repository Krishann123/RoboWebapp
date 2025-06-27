import type { APIRoute } from "astro";
import { setSelectedIndex } from "@/components/db"; 

export const POST: APIRoute = async ({ request }) => {
  const { selectedIndex } = await request.json();

  // Update the selected index using your function
  await setSelectedIndex(selectedIndex);

  return new Response(
    JSON.stringify({ success: true, selectedIndex }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};