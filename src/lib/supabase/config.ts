// The linked production project is safe to keep as a URL fallback. The anon
// key remains environment-only because it is project-specific configuration.
const FALLBACK_SUPABASE_URL = 'https://dpzmfcxyjlnkmnlbjghx.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'local-preview-anon-key';

export function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== FALLBACK_SUPABASE_ANON_KEY
  );
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY,
  };
}

export function getSupabaseServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || FALLBACK_SUPABASE_ANON_KEY;
}
