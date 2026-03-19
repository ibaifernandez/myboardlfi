import { createClient } from '@supabase/supabase-js';

// Anon key only — safe to use client-side
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
