import { NextResponse, type NextRequest } from 'next/server';

/**
 * Query-string URLs (`?page=2`, `?district=...`, `?year=...`) are filter/pagination views of
 * a listing. Their canonical already points at the base path; this additionally keeps them
 * out of the index (links stay followable) so Google spends its crawl on real pages. Plain
 * URLs and detail pages are untouched. `/search` sets its own noindex.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (request.nextUrl.searchParams.size > 0) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return response;
}

export const config = {
  // Pages only - skip Next internals, API proxy and static files.
  matcher: ['/((?!api/|_next/|.*\..*).*)'],
};
