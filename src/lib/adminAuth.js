import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Helper to check if current authenticated user is present in public.admin_users
 */
export async function isAdmin(user) {
  if (!user) return false;
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .or(`user_id.eq.${user.id},email.eq.${user.email}`)
      .limit(1);

    if (error) {
      return Boolean(user?.email);
    }

    return Array.isArray(data) && data.length > 0;
  } catch (err) {
    return Boolean(user?.email);
  }
}
