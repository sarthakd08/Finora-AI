import { createClient } from '@supabase/supabase-js';
import { currentUser, clerkClient } from '@clerk/nextjs/server';

// Create admin client with service role key (for bypassing RLS)
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export interface SupabaseUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Syncs a Clerk user to Supabase by user ID
 * Use this version when you already have the user ID (e.g., from middleware)
 */
export async function syncUserToSupabaseById(userId: string): Promise<SupabaseUser | null> {
  try {
    const supabase = getAdminClient();

    console.log('🔄 Syncing user to Supabase:', userId);

    // Get user info from Clerk using clerkClient (works in middleware)
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);
    
    if (!clerkUser) {
      console.log(' User not found in Clerk');
      return null;
    }

    // Prepare user data
    const userData: SupabaseUser = {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      first_name: clerkUser.firstName || undefined,
      last_name: clerkUser.lastName || undefined,
      full_name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || undefined,
      image_url: clerkUser.imageUrl || undefined,
    };

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingUser) {
      // User exists, update their info
      console.log(' User exists, updating...');
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error(' Error updating user:', error);
        return null;
      }

      console.log(' User updated successfully');
      return data;
    } else {
      // User doesn't exist, create new
      console.log(' User does not exist, creating...');
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error(' Error creating user:', error);
        return null;
      }

      console.log('Succes:: User created successfully');
      return data;
    }
  } catch (error) {
    console.error(' Error in syncUserToSupabaseById:', error);
    return null;
  }
}

/**
 * Syncs the current Clerk user to Supabase
 * Use this version in API routes or server components
 */
export async function syncUserToSupabase(): Promise<SupabaseUser | null> {
  try {
    // Get current user from Clerk
    const user = await currentUser();
    
    if (!user) {
      console.log('No user found in Clerk');
      return null;
    }

    return await syncUserToSupabaseById(user.id);
  } catch (error) {
    console.error('Error in syncUserToSupabase:', error);
    return null;
  }
}

/**
 * Get user from Supabase by Clerk ID
 */
export async function getUserFromSupabase(userId: string): Promise<SupabaseUser | null> {
  try {
    const supabase = getAdminClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserFromSupabase:', error);
    return null;
  }
}
