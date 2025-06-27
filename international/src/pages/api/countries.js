import { supabase } from "../../lib/supabase-client";

export async function GET({ request }) {
  try {
    // Get all country sites
    const { data: countrySites, error } = await supabase
      .from("CountrySites")
      .select("*")
      .order("name");
      
    if (error) {
      console.error("Error fetching country sites:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to fetch country sites" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ countrySites }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in countries GET:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return new Response(JSON.stringify({ 
        error: "Name and slug are required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Check if slug already exists
    const { data: existingSite } = await supabase
      .from("CountrySites")
      .select("slug")
      .eq("slug", data.slug)
      .single();
      
    if (existingSite) {
      return new Response(JSON.stringify({ 
        error: "A country site with this slug already exists" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Create country site
    const { data: newSite, error } = await supabase
      .from("CountrySites")
      .insert([{
        name: data.name,
        slug: data.slug,
        description: data.description || "",
        flagUrl: data.flagUrl || null,
        active: data.active !== undefined ? data.active : true,
        templateIndex: data.templateIndex || 0,
        customStyles: data.customStyles || {
          primaryColor: "#00008b",
          secondaryColor: "#FFB366",
          accentColor: "#6AAAFF",
          backgroundColor: "#FFFFFF"
        },
        content: data.content || {}
      }])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating country site:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to create country site" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "Country site created successfully",
      countrySite: newSite
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in countries POST:", err);
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
    
    // Validate ID
    if (!data.id) {
      return new Response(JSON.stringify({ 
        error: "Country site ID is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Remove id from the update data
    const { id, ...updateData } = data;
    
    // Update country site
    const { data: updatedSite, error } = await supabase
      .from("CountrySites")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Error updating country site:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to update country site" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "Country site updated successfully",
      countrySite: updatedSite
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in countries PUT:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function DELETE({ request }) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return new Response(JSON.stringify({ 
        error: "Country site ID is required" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Delete country site
    const { error } = await supabase
      .from("CountrySites")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Error deleting country site:", error);
      return new Response(JSON.stringify({ 
        error: "Failed to delete country site" 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: "Country site deleted successfully" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Unexpected error in countries DELETE:", err);
    return new Response(JSON.stringify({ 
      error: "Internal server error" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
} 