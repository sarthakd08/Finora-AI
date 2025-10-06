import { NextResponse } from 'next/server';
import { syncUserToSupabase } from '@/lib/supabase/sync-user';
import { auth } from '@clerk/nextjs/server';

/**
 * API Route to manually sync the current user to Supabase
 * GET /api/sync-user
 */
export async function GET() {
  try {
    // Check if user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    // Sync user to Supabase
    const syncedUser = await syncUserToSupabase();

    if (!syncedUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to sync user' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User synced successfully',
      user: syncedUser
    });
  } catch (error) {
    console.error('Error in sync-user route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
