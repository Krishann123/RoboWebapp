import type { APIRoute } from "astro";
import { addNewsCard } from "@/components/db"; // adjust path based on your structure
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const data = {
    NewsCard : {
        title: body.title,
        date: body.date,
        description: body.description,
        image: body.image,
        alt: body.alt,
        link: body.link,
      }
  }
  try {
    await addNewsCard(body.category, data);
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
