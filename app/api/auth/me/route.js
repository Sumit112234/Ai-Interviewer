import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

const AUTH_COOKIE = "auth_token"

export async function GET() {
  try {
       const cookieStore = await cookies();
       const token = cookieStore.get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()
    const user = await User.findById(payload.sub).select("-password")
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
