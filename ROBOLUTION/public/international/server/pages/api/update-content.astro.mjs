import { u as updateContent } from '../../chunks/db_BgTuE01l.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
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
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Update failed", details: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
