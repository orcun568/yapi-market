// middleware.js
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "my-secret",
  });

  const isAuth = !!token;
  const { pathname } = req.nextUrl;

  if (!isAuth && pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};

