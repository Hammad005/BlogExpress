import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import User from "../models/User";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";

export async function POST(req: NextRequest) {
  await dbConnection();

  const { email } = await req.json();
  const authResult = await verifyAuth(req);
  const { user } = authResult as AuthSuccess;
  if (user.email === email) {
    return NextResponse.json(
      { message: "Email is available." },
      { status: 200 }
    )
  }
  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return NextResponse.json(
        { error: "Email is already in use!" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: "Email is available." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Server error while checking email." },
      { status: 500 }
    );
  }
}
