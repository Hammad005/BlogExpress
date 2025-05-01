import { NextResponse } from "next/server";
import dbConnection from "../db/db";
import User from "../models/User";

export async function GET() {
  await dbConnection();
  try {
      const users = await User.find({}).sort({createdAt: -1}).select("-password"); 
        return NextResponse.json(users, { status: 200 });
  } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}