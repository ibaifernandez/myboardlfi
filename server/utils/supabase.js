const { createClient } = require('@supabase/supabase-js');

// Client with service_role key — use only server-side, never expose to client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Client with anon key — for operations respecting RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = { supabase, supabaseAdmin };
