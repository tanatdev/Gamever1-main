import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

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
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname;

    // Public routes that don't need auth
    const isPublicRoute = path === '/' || path.startsWith('/login') || path.startsWith('/register') || path === '/leaderboard';

    if (!user && !isPublicRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = '/login'
        return NextResponse.redirect(redirectUrl)
    }

    // For authenticated users, fetch profile ONCE and use for all checks
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle()

        const role = profile?.role;

        // If on login/register, redirect to appropriate dashboard
        if (path.startsWith('/login') || path.startsWith('/register')) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = role === 'teacher' ? '/teacher' : '/dashboard'
            return NextResponse.redirect(redirectUrl)
        }

        // Teacher-only routes
        if (path.startsWith('/teacher') && role !== 'teacher') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/dashboard'
            return NextResponse.redirect(redirectUrl)
        }

        // Student-only routes
        if (path.startsWith('/dashboard') && role === 'teacher') {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/teacher'
            return NextResponse.redirect(redirectUrl)
        }
    }

    return supabaseResponse
}
