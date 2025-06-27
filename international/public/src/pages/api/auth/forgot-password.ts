import type { APIRoute } from "astro";
import { supabase } from "@/lib/supabase-client"

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("forgot-email");

  // if (!email || typeof email !== "string") {
  //   return new Response(
  //     JSON.stringify({ success: false, message: "Email is required." }),
  //     { status: 400, headers: { "Content-Type": "application/json" } }
  //   );
  // }

  const { error } = await supabase.auth.resetPasswordForEmail(email as string, {
    redirectTo: `${import.meta.env.PUBLIC_SITE_URL}/reset-password`
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
      message: "If this email is registered, a reset link has been sent.",
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
};