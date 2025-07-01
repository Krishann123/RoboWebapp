export { renderers } from '../../renderers.mjs';

const GET = async ({ request, cookies }) => {
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  if (accessToken && refreshToken) {
    return new Response(
      JSON.stringify({
        authenticated: true,
        source: "international",
        adminAccess: true
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  const robolutionSession = cookies.get("robolution_session");
  if (robolutionSession) {
    return new Response(
      JSON.stringify({
        authenticated: true,
        source: "robolution",
        adminAccess: false
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
  try {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const mainAppUrl = `${protocol}://${host.split(":")[0]}:3000/api/check-session`;
    console.log("Checking session with main app at:", mainAppUrl);
    const mainAppResponse = await fetch(mainAppUrl, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("cookie") || "",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "include"
    });
    const mainAppData = await mainAppResponse.json();
    return new Response(
      JSON.stringify({
        authenticated: mainAppData.authenticated,
        source: "robolution-api",
        adminAccess: false,
        originalResponse: mainAppData
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error checking session with main app:", error);
    return new Response(
      JSON.stringify({
        authenticated: false,
        source: "error",
        error: error.message
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
