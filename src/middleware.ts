import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { syncUserToSupabaseById } from "@/lib/supabase/sync-user";

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)', '/'])

export default clerkMiddleware(async (auth, request) => {
  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
    
    // After authentication, sync user to Supabase
    // Get the authenticated user ID
    const { userId } = await auth();
    
    if (userId) {
      // Syncing in background, to not block the request
      syncUserToSupabaseById(userId).catch(err => {
        console.error('Background sync error:', err);
      });
    }
  }
  
  return NextResponse.next();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
