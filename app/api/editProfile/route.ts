import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import User from "../models/User";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";


export async function PUT(req: NextRequest) {
  await dbConnection();
  const authResult = await verifyAuth(req);

  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult as AuthSuccess;

  const { name, email, bio } = await req.json();
  const newData = { name, email, bio };

  if (user.email !== email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use!" }, { status: 409 });
    }
  }
  try {

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(user.id, newData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error("Updating Profile Error:", error);
    return NextResponse.json({ error: "Error Updating Profile" }, { status: 500 });
  }
}
