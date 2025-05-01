import { NextResponse } from "next/server";
import dbConnection from "../db/db";
import Blog from "../models/Blog";

export async function GET() {
  await dbConnection();
  try {
      const blogs = await Blog.find({}).populate("blogOwner", "name profilePics").sort({createdAt: -1}); 
      return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}