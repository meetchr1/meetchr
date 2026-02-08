import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/hub"];

// Routes that should redirect to /survey if already logged in
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // If Supabase env vars are not configured, pass through without auth
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Skip auth redirects for API routes — they handle their own auth
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
    let supabaseResponse = NextResponse.next({
      request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    // Refreshing the auth token
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Redirect unauthenticated users away from protected routes
    if (
      !user &&
      protectedRoutes.some((route) => pathname.startsWith(route))
    ) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from auth routes
    if (user && authRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/survey", request.url));
    }

    return supabaseResponse;
  } catch {
    // If Supabase auth fails for any reason, pass through without blocking
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
