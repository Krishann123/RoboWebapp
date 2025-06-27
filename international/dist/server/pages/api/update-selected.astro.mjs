import { s as setSelectedIndex } from '../../chunks/db_BgTuE01l.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  const { selectedIndex } = await request.json();
  await setSelectedIndex(selectedIndex);
  return new Response(
    JSON.stringify({ success: true, selectedIndex }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
