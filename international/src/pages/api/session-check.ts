import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, cookies }) => {
  // First check if user is logged in with Supabase
  const accessToken = cookies.get("sb-access-token");
  const refreshToken = cookies.get("sb-refresh-token");
  
  // If logged in with Supabase, return authenticated
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
  
  // Check for ROBOLUTION session cookie
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
  
  // If no session is found, try to check with the main app
  try {
    // Get the host from the request
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    
    // Construct the main app URL
    const mainAppUrl = `${protocol}://${host.split(":")[0]}:3000/api/check-session`;
    console.log("Checking session with main app at:", mainAppUrl);
    
    // Forward the request to the main app with all cookies
    const mainAppResponse = await fetch(mainAppUrl, {
      method: "GET",
      headers: {
        "Cookie": request.headers.get("cookie") || "",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      },
      credentials: "include"
    });
    
    // Get the response from the main app
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
    
    // Return not authenticated if there was an error
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