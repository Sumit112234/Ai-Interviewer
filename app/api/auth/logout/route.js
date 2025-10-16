import { NextResponse } from "next/server"

const AUTH_COOKIE = "auth_token"

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 })
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return res
}
