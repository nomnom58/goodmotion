import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { BYPASS_AUTH } from '@/lib/auth-config'
import { NextResponse } from 'next/server'

// Định nghĩa các route công khai (ai cũng xem được)
const isPublicRoute = createRouteMatcher([
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/section/(.*)' // Cho phép xem chi tiết nhưng chưa lấy được link Remix
])

export default BYPASS_AUTH
    ? () => NextResponse.next()
    : clerkMiddleware(async (auth, request) => {
        if (!isPublicRoute(request)) {
            await auth.protect()
        }
    })

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
}