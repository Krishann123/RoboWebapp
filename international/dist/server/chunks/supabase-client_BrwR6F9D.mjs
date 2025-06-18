import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://zrwokrbdolhwjwabonwk.supabase.co/",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpyd29rcmJkb2xod2p3YWJvbndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3MjgyMDAsImV4cCI6MjA1OTMwNDIwMH0.aTj5w3lP0p3PurDhR_sIYT1fszvoAV4PpAuOMEX18ZA"
);

export { supabase as s };
