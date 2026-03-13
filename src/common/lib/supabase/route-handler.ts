import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Supabase client for API Route Handlers. Reads session from request cookies,
 * writes updated cookies to a response (no NextResponse.next() - not allowed in route handlers).
 */
export function createRouteHandlerClient(request: NextRequest) {
  const response = NextResponse.json(null, { status: 200 });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  return { supabase, getResponse: () => response };
}
