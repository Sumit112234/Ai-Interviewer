import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { verifyToken } from "@/lib/auth"

const AUTH_COOKIE = "auth_token"
const ALLOWED_FIELDS = ["name", "role", "education", "workExperience", "projects", "skills", "additionalInfo"]


export async function PUT(request) {
  try {
   const cookieStore = await cookies();
   const token = cookieStore.get(AUTH_COOKIE)?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const data = await request.json()
    const update = {}
    ALLOWED_FIELDS.forEach((k) => {
      if (k in data) update[k] = data[k]
    })
    update.updatedAt = new Date()

    await dbConnect()
    const user = await User.findByIdAndUpdate(payload.sub, update, {
      new: true,
      runValidators: true,
      select: "-password",
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
