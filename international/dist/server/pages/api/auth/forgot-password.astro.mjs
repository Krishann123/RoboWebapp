import { s as supabase } from '../../../chunks/supabase-client_BrwR6F9D.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("forgot-email");
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${undefined                               }/reset-password`
  });
  if (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(
    JSON.stringify({
      success: true,
      message: "If this email is registered, a reset link has been sent."
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
