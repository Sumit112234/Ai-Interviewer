import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import User from "@/models/User"
import { signToken } from "@/lib/auth"


const AUTH_COOKIE = "auth_token"
export async function POST(request) {
  // try {
    const { name, email, password, google } = await request.json()
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await dbConnect()

    let existingUser = await User.findOne({ email })
    if (existingUser && !google) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    if(existingUser){

    }
    else{
      const hashed = await bcrypt.hash(password, 10)
      existingUser = await User.create({ name, email, password : hashed , provider: google ? "google" : "local" })
    }


    
        const token = signToken({ sub: String(existingUser._id), email: existingUser.email })
        const res = NextResponse.json({ ok: true }, { status: 201 })
    
        res.cookies.set(AUTH_COOKIE, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
    
        return res
    
  // } catch (e) {
  //   return NextResponse.json({ error: "Server error" }, { status: 500 })
  // }
}
