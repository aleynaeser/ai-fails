import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims()
  const user = data?.claims

  const pathname = request.nextUrl.pathname
  const locales = ['tr', 'en'] as const
  const defaultLocale = 'tr'
  const localeSegment = locales.find((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))
  const pathWithoutLocale = localeSegment ? (pathname.slice(localeSegment.length + 2) || '/') : pathname
  /** Always use locale in path so [locale] route matches (e.g. /tr/auth/login). */
  const prefix = localeSegment ? `/${localeSegment}` : `/${defaultLocale}`

  const isAuthPage =
    pathWithoutLocale === '/auth/login' ||
    pathWithoutLocale === '/auth/register' ||
    pathWithoutLocale.startsWith('/auth/')
  const isAppPage =
    pathWithoutLocale === '/' || pathWithoutLocale === '/dashboard' || pathWithoutLocale.startsWith('/dashboard/')

  if (!user && isAppPage) {
    const url = request.nextUrl.clone()
    url.pathname = `${prefix}/auth/login`
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value, c))
    return redirect
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = `${prefix}/dashboard`
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value, c))
    return redirect
  }

  if (user && pathWithoutLocale === '/') {
    const url = request.nextUrl.clone()
    url.pathname = `${prefix}/dashboard`
    const redirect = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c.name, c.value, c))
    return redirect
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}