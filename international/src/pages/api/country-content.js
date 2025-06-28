import { supabase } from "../../lib/supabase-client";

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");
    
    if (!slug) {
      return new Response(JSON.stringify({ 
        error: "Country slug is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Get country site content
    const { data: countrySite, error } = await supabase
      .from("CountrySites")
      .select("content")
      .eq("slug", slug)
      .single();
      
    if (error) {
      console.error("Error fetching country site content:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to fetch country site content" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      content: countrySite.content || {} 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in country-content GET:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function PUT({ request }) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.slug || !data.content) {
      return new Response(JSON.stringify({ 
        error: "Slug and content are required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Update country site content
    const { data: updatedSite, error } = await supabase
      .from("CountrySites")
      .update({ content: data.content })
      .eq("slug", data.slug)
      .select("content")
      .single();
      
    if (error) {
      console.error("Error updating country site content:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to update country site content" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "Country site content updated successfully",
      content: updatedSite.content
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in country-content PUT:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Update a specific section of content
export async function PATCH({ request }) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.slug || !data.path || data.value === undefined) {
      return new Response(JSON.stringify({ 
        error: "Slug, path, and value are required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Get current content
    const { data: countrySite, error: fetchError } = await supabase
      .from("CountrySites")
      .select("content")
      .eq("slug", data.slug)
      .single();
      
    if (fetchError) {
      console.error("Error fetching country site content:", fetchError);
      return new Response(JSON.stringify({ 
        error: "Failed to fetch country site content" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Create or update nested path
    const content = countrySite.content || {};
    const pathParts = data.path.split('.');
    
    // Create a deep copy of the content
    const updatedContent = JSON.parse(JSON.stringify(content));
    
    // Navigate to the nested property
    let current = updatedContent;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    // Set the value at the final path
    current[pathParts[pathParts.length - 1]] = data.value;
    
    // Update the content in the database
    const { data: updatedSite, error } = await supabase
      .from("CountrySites")
      .update({ content: updatedContent })
      .eq("slug", data.slug)
      .select("content")
      .single();
      
    if (error) {
      console.error("Error updating country site content:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to update country site content" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "Country site content updated successfully",
      content: updatedSite.content
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in country-content PATCH:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
} 