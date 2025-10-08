import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role key (bypasses RLS)
function getServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated with Clerk
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get consultation data from request
    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.userId || !body.userEmail || !body.title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the userId in the request matches the authenticated user
    if (body.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'User ID mismatch' },
        { status: 403 }
      );
    }

    // Create Supabase client with service role key
    const supabase = getServiceRoleClient();
    
    console.log('💾 Saving consultation to database (API route)...');
    
    // Insert consultation
    const { data, error } = await supabase
      .from('consultations')
      .insert({
        id: body.id,
        user_id: body.userId,
        user_email: body.userEmail,
        title: body.title,
        category: body.category,
        description: body.description,
        goals: body.goals,
        date: body.date,
        duration: body.duration,
        status: body.status,
        agent_name: body.agentName,
        summary: body.summary,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('✅ Consultation saved successfully:', data);
    
    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('❌ Error in consultations API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Verify user is authenticated
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create Supabase client with service role key
    const supabase = getServiceRoleClient();
    
    // Get all consultations for the user
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching consultations:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('❌ Error in consultations GET:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
