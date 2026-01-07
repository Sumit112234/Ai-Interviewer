// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// const AUTH_COOKIE = "auth_token"

// /* Pages that do NOT require login */
// const PUBLIC_PATHS = ["/login", "/signup"]

// /* Pages that REQUIRE login */
// const PROTECTED_PATHS = ["/report", "/interview", "/Form"]

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get(AUTH_COOKIE)?.value

//   const isPublic = PUBLIC_PATHS.includes(pathname)
//   const isProtected = PROTECTED_PATHS.includes(pathname)

//   /* ❌ Not logged in → block protected pages */
//   if (!token && isProtected) {
//     const url = request.nextUrl.clone()
//     url.pathname = "/login"
//     return NextResponse.redirect(url)
//   }

//   /* ❌ Logged in → block login/signup */
//   if (token && isPublic) {
//     const url = request.nextUrl.clone()
//     url.pathname = "/dashboard"
//     return NextResponse.redirect(url)
//   }

//   return NextResponse.next()
// }




// =======================

import { NextResponse } from "next/server"

export function middleware(request) {
  // Always allow access — no auth checks
  return NextResponse.next()
}

export const config = {
  // Optionally, you can still limit it to these routes (or remove matcher entirely)
  matcher: ["/login", "/signup", "/dashboard", "/profile"],
}

// -----------------------

// import { NextResponse } from "next/server"

// const AUTH_COOKIE = "auth_token"
// const PUBLIC_AUTH_PATHS = ["/login", "/signup"]
// const PROTECTED_PATHS = ["/dashboard", "/profile"]

// export function middleware(request) {
//   const { pathname } = request.nextUrl
//   const token = request.cookies.get(AUTH_COOKIE)?.value

//   const isAuthPage = PUBLIC_AUTH_PATHS.includes(pathname)
//   const isProtectedPage = PROTECTED_PATHS.includes(pathname)

//   // If logged in, block access to login/signup
//   if (token && isAuthPage) {
//     const url = request.nextUrl.clone()
//     url.pathname = "/dashboard"
//     return NextResponse.redirect(url)
//   }

//   // If not logged in, block access to protected pages
//   if (!token && isProtectedPage) {
//     const url = request.nextUrl.clone()
//     url.pathname = "/login"
//     return NextResponse.redirect(url)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   // Only pages (no _next/static etc.)
//   matcher: ["/login", "/signup", "/dashboard", "/profile"],
// }
