import { NextResponse } from "next/server";
import dbConnection from "../db/db";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  await dbConnection();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
        return NextResponse.json({ error: "Invalid Credentials!" }, { status: 409 });
    }

    const comparedPassword = await bcrypt.compare(password, user.password);
    if (!comparedPassword) {
      return NextResponse.json({ error: "Invalid Credentials!" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "2d",
    });

    // Set cookie
    (await cookies()).set("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 2, // 2 days
    });

    // Remove password before sending user in response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json({
        message: "Login successful",
        user: userWithoutPassword,
    });
  } catch (error) {
    console.log("Login Error:", error);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  }
}
