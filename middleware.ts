import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
    if (!isPublicRoute(req)){
      await auth.protect()
    }

    // Only redirect if coming from sign-up page to root
    if (req.nextUrl.pathname === '/' && req.headers.get('referer')?.includes('/sign-up')) {
      const profileUrl = new URL('/profile', req.url)
      return Response.redirect(profileUrl)
    }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}