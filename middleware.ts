// // declare const process: {
// //   env: {
// //     NEXT_PUBLIC_SUPABASE_URL?: string
// //     NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
// //   }
// // }

// // import { createServerClient } from '@supabase/ssr'
// // import { NextResponse, type NextRequest } from 'next/server'

// // export async function middleware(request: NextRequest) {
// //   let supabaseResponse = NextResponse.next({ request })
// //   const supabase = createServerClient(
// //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
// //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
// //     {
// //       cookies: {
// //         getAll() { return request.cookies.getAll() },
// //         setAll(cookiesToSet) {
// //           cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
// //           supabaseResponse = NextResponse.next({ request })
// //           cookiesToSet.forEach(({ name, value, options }) =>
// //             supabaseResponse.cookies.set(name, value, options)
// //           )
// //         },
// //       },
// //     }
// //   )

// //   const { data: { user } } = await supabase.auth.getUser()

// //   // Protected routes: /admin/* and /create-setup etc.
// //   if (request.nextUrl.pathname.startsWith('/admin') && !user) {
// //     const url = request.nextUrl.clone()
// //     url.pathname = '/login'
// //     return NextResponse.redirect(url)
// //   }

// //   return supabaseResponse
// // }

// // export const config = {
// //   matcher: ['/admin/:path*', '/create-setup']  // add all protected paths
// // }













// import { createServerClient } from '@supabase/ssr'
// import { NextResponse, type NextRequest } from 'next/server'

// export async function middleware(request: NextRequest) {
//   let supabaseResponse = NextResponse.next({ request })

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         getAll() {
//           return request.cookies.getAll()
//         },
//         setAll(cookiesToSet) {
//           // 1. Update the incoming request's cookies (object form)
//           cookiesToSet.forEach(({ name, value, options }) =>
//             request.cookies.set({ name, value, ...options })
//           )

//           // 2. Create a new response and also set cookies in it
//           supabaseResponse = NextResponse.next({ request })
//           cookiesToSet.forEach(({ name, value, options }) =>
//             supabaseResponse.cookies.set({ name, value, ...options })
//           )
//         },
//       },
//     }
//   )

//   // Refresh session / get user
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   // Protect routes
//   if (request.nextUrl.pathname.startsWith('/admin') && !user) {
//     const url = request.nextUrl.clone()
//     url.pathname = '/login'
//     return NextResponse.redirect(url)
//   }

//   return supabaseResponse
// }

// export const config = {
//   matcher: ['/admin/:path*', '/create-setup'],
// }

















import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  // Get session
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Fetch profile with role & status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single()

    // If no profile or status not active or role is pending → redirect
    if (!profile || profile.status !== 'active' || profile.role === 'pending') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Only admin can access /admin/users
    if (request.nextUrl.pathname.startsWith('/admin/users') && profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    // Add more restrictions if needed (e.g., manager cannot access /admin/settings)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*', '/create-setup'],
}