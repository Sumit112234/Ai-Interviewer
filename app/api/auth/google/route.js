import { NextResponse } from "next/server"
import { OAuth2Client } from "google-auth-library"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { signToken } from "@/lib/auth"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const AUTH_COOKIE = "auth_token"

export async function POST(req) {
  console.log("Google auth route called")
  try {
    const { idToken } = await req.json()
    if (!idToken) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 })
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 401 })
    }

    await dbConnect()

    let user = await User.findOne({ email: payload.email })

    // Auto-signup if first time
    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        provider: "google",
      })
    }

    const token = signToken({
      sub: String(user._id),
      email: user.email,
    })

    const res = NextResponse.json({ ok: true })
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return res
  } catch (err) {
    return NextResponse.json({ error: "Google auth failed" }, { status: 500 })
  }
}
