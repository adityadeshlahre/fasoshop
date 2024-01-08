import { NextRequest, NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
const token = true;
export function middleware(request: NextRequest) {
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/account", "/order"],
};
