import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token: any } }) {
    const token = req.nextauth?.token;
    const pathname = req.nextUrl.pathname;

    // If accessing auth pages while logged in, redirect to dashboard
    if (pathname.startsWith("/auth") && token) {
      const firstOrg = (token.memberships as any[])?.[0];
      if (firstOrg) {
        return NextResponse.redirect(new URL(`/${firstOrg.organizationId}/dashboard`, req.url));
      }
    }

    // If accessing dashboard without orgId, redirect to first org
    if (pathname.startsWith("/dashboard") && token) {
      const firstOrg = (token.memberships as any[])?.[0];
      if (firstOrg) {
        return NextResponse.redirect(new URL(`/${firstOrg.organizationId}/dashboard`, req.url));
      }
    }

    // Extract orgId from pathname
    const orgIdMatch = pathname.match(/^\/([^/]+)/);
    const orgId = orgIdMatch?.[1];

    if (orgId && token) {
      const membership = (token.memberships as any[])?.find((m: any) => m.organizationId === orgId);
      if (!membership) {
        // User doesn't have access to this organization
        const firstOrg = (token.memberships as any[])?.[0];
        if (firstOrg) {
          return NextResponse.redirect(new URL(`/${firstOrg.organizationId}/dashboard`, req.url));
        }
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Allow access to auth pages without token
        if (pathname.startsWith("/auth")) {
          return true;
        }

        // Require token for all other pages
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
